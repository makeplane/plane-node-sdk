/**
 * Workspace-scoped; lists the (empty) log of one disposable, inactive webhook created through `v2.workspaces.webhooks`, no project provisioned.
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
    const webhook = await client.v2.workspaces.webhooks.create(env.workspaceSlug, {
      url: "https://example.com/plane-webhook",
      name: uniqueName("webhook-logs"),
      is_active: false,
    });
    webhookId = webhook.id;
  });

  afterAll(async () => {
    if (!webhookId) return;
    await client.v2.workspaces.webhooks.delete(env.workspaceSlug, webhookId).catch(() => undefined);
  });

  it("lists delivery logs for a freshly created (empty) webhook", async () => {
    const webhookLogs = client.v2.workspaces.webhooks.logs;

    const page = await webhookLogs.list(env.workspaceSlug, webhookId);
    expect(Array.isArray(page.data)).toBe(true);
  });
});
