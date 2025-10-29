import { OAuthClient } from "../../src/client/oauth-client";
import { describeIf as describe } from "../helpers/conditional-tests";

const hasOAuthEnv = !!(
  process.env.PLANE_BASE_URL &&
  process.env.PLANE_CLIENT_ID &&
  process.env.PLANE_CLIENT_SECRET &&
  process.env.PLANE_REDIRECT_URI &&
  process.env.PLANE_APP_INSTALLATION_ID
);

describe(hasOAuthEnv, "OAuth API Tests", () => {
  let oauthClient: OAuthClient;
  let baseUrl: string;
  let clientId: string;
  let clientSecret: string;
  let redirectUri: string;
  let appInstallationId: string;

  beforeAll(() => {
    baseUrl = process.env.PLANE_BASE_URL!;
    clientId = process.env.PLANE_CLIENT_ID!;
    clientSecret = process.env.PLANE_CLIENT_SECRET!;
    redirectUri = process.env.PLANE_REDIRECT_URI!;
    appInstallationId = process.env.PLANE_APP_INSTALLATION_ID!;

    oauthClient = new OAuthClient({
      baseUrl,
      clientId,
      clientSecret,
      redirectUri,
    });
  });

  it("should generate authorization URL", () => {
    const authUrl = oauthClient.getAuthorizationUrl();

    expect(authUrl).toBeDefined();
    expect(typeof authUrl).toBe("string");
    expect(authUrl).toContain(baseUrl);
    expect(authUrl).toContain(clientId);
  });

  it("should get bot token", async () => {
    const botToken = await oauthClient.getBotToken(appInstallationId);

    expect(botToken).toBeDefined();
    expect(botToken.access_token).toBeDefined();
    expect(typeof botToken.access_token).toBe("string");
  });

  it("should get app installations", async () => {
    const botToken = await oauthClient.getBotToken(appInstallationId);
    const installations = await oauthClient.getAppInstallations(botToken.access_token);

    expect(installations).toBeDefined();
    expect(Array.isArray(installations)).toBe(true);
  });
});
