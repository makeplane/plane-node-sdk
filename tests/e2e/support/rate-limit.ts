/**
 * Bounded 429 retry for the live suites — harness plumbing only, never shipped SDK
 * behaviour.
 *
 * One API key carries this whole run, and the server throttles per key, so a long e2e
 * run saturates its own window and answers `429` for a while. That is a transient
 * property of the environment, not a defect in the SDK, and the only honest response is
 * to wait exactly as long as the server asked and try again.
 *
 * Both API versions are covered, because both hit the same quota and only one of them
 * was retrying:
 *
 * - **api_v2** decodes its own errors, so `PlaneApiError.detail` carries the wait
 *   (`"Rate limit exceeded. Retry after 58 seconds."`) that the `Retry-After` header
 *   states — see plane-ee `api_v2/core/exceptions.py`. {@link planeApiRateLimit} reads it.
 * - **v1** goes through `BaseResource`, which calls the global `axios` and lets axios
 *   raise, so the response — and with it the real `Retry-After` header DRF sets — is
 *   still attached to the error. {@link installAxiosRateLimitRetry} reads the header.
 *
 * Bounds, so a rate-limited run degrades instead of hanging: at most
 * {@link MAX_ATTEMPTS} tries per request, at most {@link RETRY_BUDGET_MS} of waiting per
 * request, and each individual wait capped at {@link MAX_BACKOFF_MS}. When the server
 * states no wait, the fallback is exponential (2s, 4s, 8s, 16s, 32s) — 62s in total,
 * chosen to span the server's one-minute throttle window without exceeding the budget.
 * Once any bound is reached the 429 propagates and the test fails, which is correct: at
 * that point the run is not being slowed by the limiter, it is being defeated by it.
 */
import axios, { InternalAxiosRequestConfig, isAxiosError } from "axios";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";

/** Tries per request: the first attempt plus at most five retries. */
const MAX_ATTEMPTS = 6;
/**
 * Total time a single request may spend waiting out 429s. Sized against the 180s Jest
 * timeout (see `jest.config.js`) so a retried request loses to the limiter, not to Jest.
 */
const RETRY_BUDGET_MS = 150_000;
/** First fallback wait when the server states none; doubles per attempt. */
const BASE_BACKOFF_MS = 2_000;
/** Ceiling on any single wait — the throttle window is a minute, so waiting longer is pointless. */
const MAX_BACKOFF_MS = 60_000;
/** Added to a server-stated wait so the retry lands after the window rolls, not on its edge. */
const RETRY_AFTER_SLACK_MS = 1_000;

/** `Rate limit exceeded. Retry after 58 seconds.` — the api_v2 wording, from `exceptions.py`. */
const RETRY_AFTER_IN_DETAIL = /retry after\s+(\d+(?:\.\d+)?)\s*seconds?/i;

/**
 * A 429 verdict: `undefined` when the error is not a rate limit at all (and so must
 * propagate untouched), otherwise the wait the server stated, if it stated one.
 */
export type RateLimitVerdict = { retryAfterSeconds: number | undefined } | undefined;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** How long to wait before attempt `attempt + 1` (zero-based). */
function backoffMs(retryAfterSeconds: number | undefined, attempt: number): number {
  if (retryAfterSeconds !== undefined && Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return Math.min(retryAfterSeconds * 1000, MAX_BACKOFF_MS) + RETRY_AFTER_SLACK_MS;
  }
  return Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
}

/** True while `attempt` (zero-based) and the time already waited leave room for another try. */
function canRetry(attempt: number, waitedMs: number, delayMs: number): boolean {
  return attempt < MAX_ATTEMPTS - 1 && waitedMs + delayMs <= RETRY_BUDGET_MS;
}

/** A `PlaneApiError` 429 from api_v2, with the wait its `detail` states. */
export function planeApiRateLimit(error: unknown): RateLimitVerdict {
  if (!(error instanceof PlaneApiError) || error.status !== 429) return undefined;
  const stated = RETRY_AFTER_IN_DETAIL.exec(error.detail ?? "");
  return { retryAfterSeconds: stated ? Number.parseFloat(stated[1]) : undefined };
}

/** `Retry-After` as seconds — the header is either a count of seconds or an HTTP-date. */
function parseRetryAfter(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const seconds = Number(trimmed);
  if (Number.isFinite(seconds)) return Math.max(seconds, 0);
  const at = Date.parse(trimmed);
  if (Number.isNaN(at)) return undefined;
  return Math.max((at - Date.now()) / 1000, 0);
}

/**
 * Runs `perform`, retrying while `classify` calls the failure a rate limit.
 *
 * Anything `classify` does not recognise is rethrown on the spot — this is a retry
 * policy, not an error sink.
 */
export async function retryOn429<T>(
  perform: () => Promise<T>,
  classify: (error: unknown) => RateLimitVerdict
): Promise<T> {
  let waitedMs = 0;
  for (let attempt = 0; ; attempt++) {
    try {
      return await perform();
    } catch (error) {
      const verdict = classify(error);
      if (!verdict) throw error;
      const delayMs = backoffMs(verdict.retryAfterSeconds, attempt);
      if (!canRetry(attempt, waitedMs, delayMs)) throw error;
      waitedMs += delayMs;
      await sleep(delayMs);
    }
  }
}

/**
 * The retry bookkeeping the axios interceptor carries on the request config, since an
 * interceptor sees one failure at a time rather than a loop it owns.
 */
type RetryableConfig = InternalAxiosRequestConfig & {
  planeRateLimitAttempt?: number;
  planeRateLimitWaitedMs?: number;
};

let axiosRetryInstalled = false;

/**
 * Teaches the **global** axios instance — the one `BaseResource` calls, and so the whole
 * v1 suite — to wait out a 429 and replay the request.
 *
 * Deliberately not installed from `tests/helpers/test-utils.ts`: the unit suites import
 * that too, and they drive the same global axios through `nock`. Only a live e2e file
 * calls this. `V2Transport` builds its own axios instance and does not see this
 * interceptor, which is why `createV2Client` installs its own wrapper.
 */
export function installAxiosRateLimitRetry(): void {
  if (axiosRetryInstalled) return;
  axiosRetryInstalled = true;

  axios.interceptors.response.use(undefined, async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 429) throw error;
    const config = error.config as RetryableConfig | undefined;
    if (!config) throw error;

    const attempt = config.planeRateLimitAttempt ?? 0;
    const waitedMs = config.planeRateLimitWaitedMs ?? 0;
    const delayMs = backoffMs(parseRetryAfter(error.response.headers?.["retry-after"]), attempt);
    if (!canRetry(attempt, waitedMs, delayMs)) throw error;

    config.planeRateLimitAttempt = attempt + 1;
    config.planeRateLimitWaitedMs = waitedMs + delayMs;
    await sleep(delayMs);
    return axios.request(config);
  });
}
