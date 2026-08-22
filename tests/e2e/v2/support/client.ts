import { PlaneClient } from "../../../../src/client/plane-client";
import { V2Transport } from "../../../../src/api/v2/kernel/transport";
import { PlaneApiError } from "../../../../src/errors/PlaneApiError";
import { V2Env } from "./env";

type RequestFn = V2Transport["request"];

const RETRY_AFTER_RE = /(\d+(?:\.\d+)?)\s*seconds?/i;
const MAX_ATTEMPTS = 8;
// 150s budget: this dev server's observed `Retry-After` runs 56-59s, so this
// leaves room for two retries under the 180s per-test timeout.
const RETRY_BUDGET_MS = 150000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries on 429 using the server's own `Retry-After`; harness plumbing only, doesn't touch shipped SDK behavior.
 */
function installRateLimitRetry(client: PlaneClient): void {
  const transport = client.v2.transport;
  const original: RequestFn = transport.request.bind(transport);

  const wrapped = async <T>(...args: Parameters<RequestFn>): Promise<T> => {
    let elapsedMs = 0;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        return await original<T>(...args);
      } catch (error) {
        if (!(error instanceof PlaneApiError) || error.status !== 429 || attempt === MAX_ATTEMPTS - 1) {
          throw error;
        }
        const match = RETRY_AFTER_RE.exec(error.detail ?? "");
        const delayMs = (match ? Number.parseFloat(match[1]) + 1 : 15) * 1000;
        if (elapsedMs + delayMs > RETRY_BUDGET_MS) {
          throw error;
        }
        elapsedMs += delayMs;
        await sleep(delayMs);
      }
    }
    throw new Error("unreachable");
  };

  transport.request = wrapped as unknown as RequestFn;
}

/** One client per test file, with the rate-limit retry wrapper installed. */
export function createV2Client(env: V2Env): PlaneClient {
  const client = new PlaneClient({ baseUrl: env.baseUrl, apiKey: env.apiKey });
  installRateLimitRetry(client);
  return client;
}
