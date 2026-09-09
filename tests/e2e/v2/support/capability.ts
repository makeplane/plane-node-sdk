/**
 * The one sanctioned way for a live v2 suite to sit out part of a run: the *server*
 * answered `402 payment_required`, meaning this workspace's plan does not include the
 * feature under test.
 *
 * Ported from the Python suite's `tests/v2/integration/_guard.skip_absent_capability`,
 * and it exists for the reason that guard states: a suite that skips silently is worse
 * than one that fails. CI runs this suite against a workspace that is not licensed for
 * several EE features, so `releases`, `customers`, `automations` and friends answer 402
 * for every write there. That is an environment limitation, not a defect — but nothing
 * here may quietly turn a defect into a green tick, so three rules hold:
 *
 * 1. **Only a 402 arms a gate.** There is no way to arm one by hand: both entry points
 *    take a thrown error and inspect its status, and anything that is not a
 *    `PlaneApiError` with `status === 402` is rethrown untouched. A 400, 403, 404, 409
 *    or 500 is a real failure and stays one.
 * 2. **Every skip is announced**, tagged with {@link CAPABILITY_PREFIX} and naming the
 *    feature flag the server refused on — once per sat-out test, and once more per file
 *    in an `afterAll` summary. `grep "server capability absent"` over a CI log therefore
 *    lists exactly what this workspace could not exercise, and nothing else.
 * 3. **A 402 mid-test still tears down.** {@link CapabilityGate.it} catches the refusal
 *    *after* the body's own `try/finally` has unwound, so cleanup registered before the
 *    server said no still runs. The gate is not a blanket `try/catch` around a suite: it
 *    wraps one test at a time and discriminates strictly on the status.
 *
 * Jest has no runtime skip — `jest-circus` fixes the run/skip decision at collection
 * time, before any request can be made — so a gated test that sits out reports as a
 * pass carrying the warning above rather than as `○ skipped`. That is the one place
 * this diverges from the Python guard, and it is exactly why rule 2 is mandatory rather
 * than a nicety.
 */
import { PlaneApiError } from "../../../../src/errors/PlaneApiError";

/** Tag every capability skip carries. Grep this over a CI log to list them all. */
export const CAPABILITY_PREFIX = "server capability absent -- ";

/** The server's own name for the flag it refused on, e.g. `FeatureFlag.RELEASES`. */
const FEATURE_FLAG_PATTERN = /FeatureFlag\.[A-Z0-9_]+/;

/**
 * What `PlaneApiError.fromPayload` fills in when a 402 body was not a problem detail.
 * Seen live on the artifacts route, so the reason has to fall back to the caller's.
 */
const OPAQUE_DETAIL = "Request failed.";

/**
 * The error as a capability refusal, or `undefined` when it is anything else.
 *
 * The status is the whole test on purpose. `code` is not: a 402 has been observed
 * carrying `code: "server_error"` rather than `payment_required`, and narrowing on the
 * code would have turned that workspace's missing licence back into a red suite.
 */
export function asAbsentCapability(error: unknown): PlaneApiError | undefined {
  return error instanceof PlaneApiError && error.status === 402 ? error : undefined;
}

/**
 * The human reason for a refusal: the feature flag if the server named one, else its own
 * detail, else the suite's declared fallback.
 */
export function capabilityReason(error: PlaneApiError, fallback: string): string {
  const detail = error.detail?.trim() ?? "";
  const flag = FEATURE_FLAG_PATTERN.exec(detail);
  if (flag) return `${flag[0]} is not enabled for this workspace`;
  if (detail && detail !== OPAQUE_DETAIL) return detail;
  return fallback;
}

export interface CapabilityGate {
  /** True once a 402 has armed this gate; every later `it` sits out. */
  readonly absent: boolean;
  /** Why, once armed — the text that follows {@link CAPABILITY_PREFIX} in the log. */
  readonly reason: string | undefined;
  /**
   * A Jest `beforeAll` whose 402 arms the gate instead of failing every test in the file.
   *
   * Any other error still fails the hook, which is the point: a broken fixture must not
   * be able to disguise itself as an unlicensed workspace.
   */
  beforeAll(setup: () => Promise<void>): void;
  /**
   * A Jest test that sits out (loudly) when the gate is armed, and arms it on a 402 of
   * its own — including one raised part-way through, after the body's `finally` has run.
   */
  it(name: string, body: () => Promise<void>): void;
}

/**
 * One gate per `describe`. `fallbackReason` names the capability in the server's own
 * terms for the case where a 402 body carries no flag name of its own.
 */
export function useCapability(fallbackReason: string): CapabilityGate {
  let reason: string | undefined;
  let satOut = 0;

  const arm = (error: PlaneApiError): void => {
    reason ??= capabilityReason(error, fallbackReason);
  };

  const announce = (testName: string): void => {
    satOut++;
    console.warn(`SKIPPED "${testName}": ${CAPABILITY_PREFIX}${reason}`);
  };

  afterAll(() => {
    if (satOut === 0) return;
    console.warn(`${satOut} test(s) sat out: ${CAPABILITY_PREFIX}${reason}`);
  });

  const gate: CapabilityGate = {
    get absent() {
      return reason !== undefined;
    },
    get reason() {
      return reason;
    },

    beforeAll(setup: () => Promise<void>): void {
      beforeAll(async () => {
        if (reason !== undefined) return;
        try {
          await setup();
        } catch (error) {
          const absent = asAbsentCapability(error);
          if (!absent) throw error;
          arm(absent);
        }
      });
    },

    it(name: string, body: () => Promise<void>): void {
      it(name, async () => {
        if (reason !== undefined) {
          announce(name);
          return;
        }
        try {
          await body();
        } catch (error) {
          const absent = asAbsentCapability(error);
          if (!absent) throw error;
          arm(absent);
          announce(name);
        }
      });
    },
  };

  return gate;
}
