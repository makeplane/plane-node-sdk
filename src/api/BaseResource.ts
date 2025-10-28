import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { Configuration } from "../Configuration";
import { HttpError } from "../errors";

/**
 * Base resource class containing HTTP logic and authentication
 * All API resources should extend this class
 */
export abstract class BaseResource {
  protected config: Configuration;
  protected apiBasePath: string = "/api/v1";

  constructor(config: Configuration) {
    this.config = config;
    if (config.enableLogging) {
      this.setupInterceptors();
    }
  }

  /**
   * Sanitize headers to remove sensitive information
   */
  private sanitizeHeaders(headers: any): any {
    if (!headers) return headers;

    const sanitized = { ...headers };
    const sensitiveKeys = [
      "authorization",
      "x-api-key",
      "cookie",
      "set-cookie",
    ];

    // iterate through sanitized and remove the sensitive keys
    for (const key in sanitized) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        sanitized[key] = "[REDACTED]";
      }
    }

    return sanitized;
  }

  /**
   * Sanitize data to remove sensitive information and limit size
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    // If data is too large, truncate it
    const dataStr = JSON.stringify(data);
    if (dataStr.length > 1000) {
      return JSON.parse(dataStr.substring(0, 1000)) + "... [TRUNCATED]";
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
  protected async httpDelete<T>(endpoint: string): Promise<void> {
    try {
      await axios.delete(this.buildUrl(endpoint), {
        headers: this.getHeaders(),
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
    if (error instanceof HttpError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.message || "Request failed";
      throw new HttpError(message, statusCode, error.response?.data);
    }

    throw new Error(`Unexpected error: ${error.message}`);
  }

  /**
   * Setup axios interceptors for request and response logging
   */
  private setupInterceptors(): void {
    // Request interceptor
    axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
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
