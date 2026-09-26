import axios, { InternalAxiosRequestConfig } from "axios";
import { Configuration } from "../Configuration";
import { HttpError } from "../errors";

/** Longest serialized body a log line carries before it is cut. */
const MAX_LOGGED_DATA_LENGTH = 1000;

/**
 * Configurations whose request logger is already installed on the global axios instance.
 *
 * Every resource and sub-resource a `PlaneClient` builds runs the `BaseResource`
 * constructor with the same `Configuration`. Installing once per resource logged every
 * request once per resource; keying on the configuration installs it once per client.
 */
const loggingInstalledFor = new WeakSet<Configuration>();

/**
 * Base resource class containing HTTP logic and authentication
 * All API resources should extend this class
 */
export abstract class BaseResource {
  protected config: Configuration;
  protected apiBasePath: string = "/api/v1";

  constructor(config: Configuration) {
    this.config = config;
    if (config.enableLogging && !loggingInstalledFor.has(config)) {
      loggingInstalledFor.add(config);
      this.setupInterceptors();
    }
  }

  /**
   * Sanitize headers to remove sensitive information
   */
  private sanitizeHeaders(headers: any): any {
    if (!headers) return headers;

    const sanitized = { ...headers };
    const sensitiveKeys = ["authorization", "x-api-key", "cookie", "set-cookie"];

    // iterate through sanitized and remove the sensitive keys
    for (const key in sanitized) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        sanitized[key] = "[REDACTED]";
      }
    }

    return sanitized;
  }

  /**
   * Sanitize data to remove sensitive information and limit size.
   *
   * Only ever feeds a log line, so it must never throw: logging describes a request and
   * must not change its outcome.
   */
  private sanitizeData(data: unknown): unknown {
    if (!data) return data;

    let dataStr: string | undefined;
    try {
      dataStr = JSON.stringify(data);
    } catch {
      return "[UNSERIALIZABLE]";
    }

    // If data is too large, truncate it. The cut lands mid-JSON, so keep it a string —
    // `JSON.parse` on it throws.
    if (dataStr !== undefined && dataStr.length > MAX_LOGGED_DATA_LENGTH) {
      return `${dataStr.slice(0, MAX_LOGGED_DATA_LENGTH)}... [TRUNCATED]`;
    }

    return data;
  }

  /**
   * GET request
   */
  protected async get<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await axios.get<T>(this.buildUrl(endpoint), {
        headers: this.getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * POST request
   */
  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await axios.post<T>(this.buildUrl(endpoint), data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await axios.put<T>(this.buildUrl(endpoint), data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await axios.patch<T>(this.buildUrl(endpoint), data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  protected async httpDelete(endpoint: string, data?: any, params?: any): Promise<void> {
    try {
      await axios.delete(this.buildUrl(endpoint), {
        headers: this.getHeaders(),
        data,
        params,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Builds the complete URL for API requests
   */
  protected buildUrl(endpoint: string): string {
    return `${this.config.baseUrl}${this.apiBasePath}${endpoint}`;
  }

  /**
   * Gets headers for API requests including authentication
   */
  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add API Key if available
    if (this.config.apiKey) {
      headers["X-Api-Key"] = this.config.apiKey;
    }

    // Add Access Token if available
    if (this.config.accessToken) {
      headers["Authorization"] = `Bearer ${this.config.accessToken}`;
    }

    return headers;
  }

  /**
   * Centralized error handling
   */
  protected handleError(error: any): never {
    if (this.config.enableLogging) {
      if (axios.isAxiosError(error)) {
        console.error("❌ [ERROR]", {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          status: error.response?.status,
          headers: this.sanitizeHeaders(error.config?.headers),
          requestData: error.config?.data ? this.sanitizeData(error.config.data) : undefined,
          responseData: this.sanitizeData(error.response?.data),
          message: error.message,
        });
      } else {
        console.error("❌ [ERROR]", error instanceof Error ? error.message : error);
      }
    }

    if (error instanceof HttpError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message = error.response?.data?.message || error.message || "Request failed";
      throw new HttpError(message, statusCode, error.response?.data);
    }

    throw new Error(`Unexpected error: ${error.message}`);
  }

  /**
   * Setup the axios request interceptor that logs requests.
   *
   * It sits on the global axios instance, which the host application and `OAuthClient`
   * use too, so it only reports requests under this client's API prefix. Matching
   * `baseUrl` alone would log `OAuthClient`'s token exchange, whose body carries the
   * client secret.
   */
  private setupInterceptors(): void {
    const apiPrefix = `${this.config.baseUrl}${this.apiBasePath}`;
    // Request interceptor
    axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.url?.startsWith(apiPrefix)) return config;
        console.log("🚀 [REQUEST]", {
          method: config.method?.toUpperCase(),
          url: config.url,
          headers: this.sanitizeHeaders(config.headers),
          data: config.data ? this.sanitizeData(config.data) : undefined,
          params: config.params,
        });
        return config;
      },
      (error) => {
        console.error("❌ [REQUEST ERROR]", error);
        return Promise.reject(error);
      }
    );
  }
}
