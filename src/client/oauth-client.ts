import axios from "axios";
import { PlaneOAuthTokenResponse, PlaneOAuthAppInstallation } from "../models/OAuth";

/**
 * Standalone OAuth client for app development
 * Does not require API authentication - perfect for OAuth app development
 */
export class OAuthClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private baseUrl: string;

  constructor(config: { baseUrl?: string; clientId: string; clientSecret: string; redirectUri: string }) {
    this.baseUrl = config.baseUrl || "https://api.plane.so";
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
  }

  /**
   * Get the authorization URL for the OAuth flow
   * @param responseType - The response type (default: "code")
   * @param state - Optional state parameter for security
   * @returns The authorization URL
   */
  getAuthorizationUrl(responseType: string = "code", state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: responseType,
      redirect_uri: this.redirectUri,
    });

    if (state) {
      params.append("state", state);
    }

    return `${this.baseUrl}/auth/o/authorize-app/?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * @param code - The authorization code
   * @param grantType - The grant type (default: "authorization_code")
   * @returns Promise resolving to token response
   */
  async exchangeCodeForToken(code: string, grantType: string = "authorization_code"): Promise<PlaneOAuthTokenResponse> {
    const data = new URLSearchParams({
      grant_type: grantType,
      code: code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });

    const response = await axios.post(`${this.baseUrl}/auth/o/token/`, data.toString(), {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  }

  /**
   * Get a new access token using a refresh token
   * @param refreshToken - The refresh token
   * @returns Promise resolving to token response
   */
  async getRefreshToken(refreshToken: string): Promise<PlaneOAuthTokenResponse> {
    const data = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await axios.post(`${this.baseUrl}/auth/o/token/`, data.toString(), {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  }

  /**
   * Get a new access token using client credentials for bot/app installations
   * @param appInstallationId - The app installation ID
   * @returns Promise resolving to token response
   */
  async getBotToken(appInstallationId: string): Promise<PlaneOAuthTokenResponse> {
    const data = new URLSearchParams({
      grant_type: "client_credentials",
      app_installation_id: appInstallationId,
    });

    const response = await axios.post(`${this.baseUrl}/auth/o/token/`, data.toString(), {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${this.getBasicAuthToken()}`,
      },
    });

    return response.data;
  }

  /**
   * Get an app installation by ID using the bot token
   * @param token - The bot token from getBotToken method
   * @param appInstallationId - The app installation ID
   * @returns Promise resolving to app installation
   */
  async getAppInstallations(token: string, appInstallationId?: string): Promise<PlaneOAuthAppInstallation[]> {
    let endpoint = "/auth/o/app-installation/";
    if (appInstallationId) {
      endpoint += `?id=${appInstallationId}`;
    }

    const response = await axios.get(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    if (!data || data.length === 0) {
      throw new Error("App installation not found");
    }

    return data;
  }

  /**
   * Generate basic auth token from client_id and client_secret
   * @returns Base64 encoded basic auth token
   */
  private getBasicAuthToken(): string {
    const credentials = `${this.clientId}:${this.clientSecret}`;
    return Buffer.from(credentials).toString("base64");
  }
}
