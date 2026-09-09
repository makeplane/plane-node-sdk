import { PlaneClient } from "../../../../src/client/plane-client";
import { V2Transport } from "../../../../src/api/v2/kernel/transport";
import { planeApiRateLimit, retryOn429 } from "../../support/rate-limit";
import { V2Env } from "./env";

type RequestFn = V2Transport["request"];

/**
 * Retries on 429 using the wait the server states; harness plumbing only, doesn't touch
 * shipped SDK behavior. The policy — and why v1 needs its own installer — lives in
 * `tests/e2e/support/rate-limit.ts`.
 *
 * Wraps `transport.request` rather than the transport's axios instance because that
 * instance is private, and because `PlaneApiError` is where the decoded 429 lands.
 */
function installRateLimitRetry(client: PlaneClient): void {
  const transport = client.v2.transport;
  const original: RequestFn = transport.request.bind(transport);

  const wrapped = <T>(...args: Parameters<RequestFn>): Promise<T> =>
    retryOn429(() => original<T>(...args), planeApiRateLimit);

  transport.request = wrapped as unknown as RequestFn;
}

/** One client per test file, with the rate-limit retry wrapper installed. */
export function createV2Client(env: V2Env): PlaneClient {
  const client = new PlaneClient({ baseUrl: env.baseUrl, apiKey: env.apiKey });
  installRateLimitRetry(client);
  return client;
}
