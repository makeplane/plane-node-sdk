import axios, { AxiosInstance, isAxiosError } from "axios";
import { Configuration } from "../../../Configuration";
import { PlaneApiError } from "../../../errors/PlaneApiError";
import { PlaneNetworkError } from "../../../errors/PlaneNetworkError";

export const API_V2_PREFIX = "/api/v2";

/**
 * HTTP plumbing for api_v2. Uses its own axios instance to avoid colliding with BaseResource's v1 interceptors.
 */
export class V2Transport {
  private client: AxiosInstance;

  constructor(public config: Configuration) {
    this.client = axios.create({
      baseURL: `${config.baseUrl.replace(/\/$/, "")}${API_V2_PREFIX}`,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      // A 4xx must reach our own decoder rather than axios' generic error.
      validateStatus: () => true,
    });
  }

  async request<T>(
    method: string,
    path: string,
    options: { params?: Record<string, unknown>; data?: unknown } = {}
  ): Promise<T> {
    try {
      const response = await this.client.request({
        method,
        url: path,
        params: options.params,
        data: options.data,
        headers: this.authHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return (response.status === 204 ? undefined : response.data) as T;
      }
      throw PlaneApiError.fromPayload(response.status, response.data);
    } catch (error) {
      if (error instanceof PlaneApiError) throw error;
      if (isAxiosError(error)) {
        // `validateStatus: () => true` means axios only throws here with no response at
        // all (network/DNS/TLS/timeout) — a real HTTP response is decoded above instead,
        // so don't fabricate a fake "HTTP 500"; use `error.message`.
        if (error.response) {
          throw PlaneApiError.fromPayload(error.response.status, error.response.data);
        }
        throw new PlaneNetworkError(error.message || "Network request failed.", error);
      }
      throw error;
    }
  }

  private authHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.config.apiKey) headers["X-Api-Key"] = this.config.apiKey;
    if (this.config.accessToken) headers["Authorization"] = `Bearer ${this.config.accessToken}`;
    return headers;
  }
}
