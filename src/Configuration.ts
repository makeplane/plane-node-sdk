/**
 * Configuration class for Plane SDK
 * Handles authentication and base URL configuration
 */
export class Configuration {
  public baseUrl: string;
  public apiKey?: string;
  public accessToken?: string;
  public enableLogging: boolean;

  constructor(config: {
    baseUrl?: string;
    apiKey?: string;
    accessToken?: string;
    enableLogging?: boolean;
  }) {
    this.baseUrl = config.baseUrl || 'https://api.plane.so';
    this.apiKey = config.apiKey;
    this.accessToken = config.accessToken;
    this.enableLogging = config.enableLogging || false;
  }

  /**
   * Validates that required configuration is present
   */
  public validate(): void {
    if (!this.baseUrl) {
      throw new Error('Base URL is required');
    }

    if (!this.apiKey && !this.accessToken) {
      throw new Error('Either apiKey or accessToken must be provided');
    }
  }
}
