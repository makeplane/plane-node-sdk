import * as runtime from "../runtime";
import { PlaneOAuthTokenResponse, PlaneOAuthAppInstallation } from "./models";

/**
 * OAuth API helper class
 */
export class OAuthApi extends runtime.BaseAPI {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private baseUrl: string;

  constructor(
    configuration: runtime.Configuration,
    oauthConfig: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
    }
  ) {
    super(configuration);
    this.clientId = oauthConfig.clientId;
    this.clientSecret = oauthConfig.clientSecret;
    this.redirectUri = oauthConfig.redirectUri;
    this.baseUrl = configuration.basePath || "https://api.plane.so";
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
  async exchangeCodeForToken(
    code: string,
    grantType: string = "authorization_code"
  ): Promise<PlaneOAuthTokenResponse> {
    const data = new URLSearchParams({
      grant_type: grantType,
      code: code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });

    const headers: runtime.HTTPHeaders = {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const response = await this.request({
      path: `/auth/o/token/`,
      method: "POST",
      headers: headers,
      body: data,
    });

    return await response.json();
  }

  /**
   * Get a new access token using a refresh token
   * @param refreshToken - The refresh token
   * @returns Promise resolving to token response
   */
  async getRefreshToken(
    refreshToken: string
  ): Promise<PlaneOAuthTokenResponse> {
    const data = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const headers: runtime.HTTPHeaders = {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const response = await this.request({
      path: `/auth/o/token/`,
      method: "POST",
      headers: headers,
      body: data,
    });

    return await response.json();
  }

  /**
   * Get a new access token using client credentials for bot/app installations
   * @param appInstallationId - The app installation ID
   * @returns Promise resolving to token response
   */
  async getBotToken(
    appInstallationId: string
  ): Promise<PlaneOAuthTokenResponse> {
    const data = new URLSearchParams({
      grant_type: "client_credentials",
      app_installation_id: appInstallationId,
    });

    const headers: runtime.HTTPHeaders = {
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${this.getBasicAuthToken()}`,
    };

    const response = await this.request({
      path: `/auth/o/token/`,
      method: "POST",
      headers: headers,
      body: data,
    });

    return await response.json();
  }

  /**
   * Get an app installation by ID using the bot token
   * @param token - The bot token from getBotToken method
   * @param appInstallationId - The app installation ID
   * @returns Promise resolving to app installation
   */
  async getAppInstallation(
    token: string,
    appInstallationId: string
  ): Promise<PlaneOAuthAppInstallation> {
    const headers: runtime.HTTPHeaders = {
      Authorization: `Bearer ${token}`,
    };

    const response = await this.request({
      path: `/auth/o/app-installation/?id=${appInstallationId}`,
      method: "GET",
      headers: headers,
    });

    const data = await response.json();
    if (!data || data.length === 0) {
      throw new runtime.ResponseError(response, "App installation not found");
    }

    return data[0];
  }

  /**
   * Generate basic auth token from client_id and client_secret
   * @returns Base64 encoded basic auth token
   */
  private getBasicAuthToken(): string {
    const credentials = `${this.clientId}:${this.clientSecret}`;
    return btoa(credentials);
  }
}
