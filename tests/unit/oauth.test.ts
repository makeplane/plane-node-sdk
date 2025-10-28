import { PlaneClient } from "../../src/client/plane-client";
import { OAuthClient } from "../../src/client/oauth-client";
import { Configuration } from "../../src/Configuration";

/**
 * Test OAuth functionality with both standalone and integrated approaches
 */
export async function testOAuth() {
  console.log("🧪 Testing OAuth functionality...");

  try {
    // Test 1: Standalone OAuth Client (for app development)
    console.log("  📋 Testing standalone OAuth client...");

    if (
      !process.env.PLANE_BASE_URL ||
      !process.env.PLANE_CLIENT_ID ||
      !process.env.PLANE_CLIENT_SECRET ||
      !process.env.PLANE_REDIRECT_URI ||
      !process.env.PLANE_APP_INSTALLATION_ID
    ) {
      console.error("❌ Skipping oauth tests, missing environment variables");
      return;
    }

    const oauthClient = new OAuthClient({
      baseUrl: process.env.PLANE_BASE_URL,
      clientId: process.env.PLANE_CLIENT_ID!,
      clientSecret: process.env.PLANE_CLIENT_SECRET!,
      redirectUri: process.env.PLANE_REDIRECT_URI!,
    });

    const authUrl = oauthClient.getAuthorizationUrl();
    console.log("  ✅ Authorization URL generated:", authUrl);

    const botToken = await oauthClient.getBotToken(process.env.PLANE_APP_INSTALLATION_ID!);

    console.log("  ✅ Bot token generated:", botToken);

    const installations = await oauthClient.getAppInstallations(botToken.access_token);

    console.log("  ✅ App installations generated:", installations);

    // Test authorization URL generation
  } catch (error) {
    console.error("❌ OAuth test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testOAuth().catch((error) => {
    console.error("❌ OAuth test failed:", error);
    process.exit(1);
  });
}
