/**
 * Workspace-scoped; lists the (empty) log of one disposable, inactive webhook created via the transport, no project provisioned.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 webhook logs (live)", () => {
  let client: PlaneClient;
  let webhookId: string;

  beforeAll(async () => {
    client = createV2Client(env);
    const webhook = await client.v2.transport.request<{ id: string }>(
      "POST",
      `/workspaces/${env.workspaceSlug}/webhooks/`,
      { data: { url: "https://example.com/plane-webhook", name: uniqueName("webhook-logs"), is_active: false } }
    );
    webhookId = webhook.id;
  });

  afterAll(async () => {
    if (!webhookId) return;
    await client.v2.transport
      .request("DELETE", `/workspaces/${env.workspaceSlug}/webhooks/${webhookId}/`)
      .catch(() => undefined);
  });

  it("lists delivery logs for a freshly created (empty) webhook", async () => {
    const webhookLogs = client.v2.workspace(env.workspaceSlug).webhooks.logs;

    const page = await webhookLogs.list(webhookId);
    expect(Array.isArray(page.data)).toBe(true);
  });
});
