import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WebhookLogs } from "../../../src/api/v2/WebhookLogs";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeLogs = () => new WebhookLogs(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("WebhookLogs (v2)", () => {
  it("lists delivery logs for a webhook", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/webhook-logs/wh-1/")
      .reply(200, {
        data: [{ id: "log-1", webhook_id: "wh-1", event_type: "work_item.created", response_status: "200" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeLogs().list(SLUG, "wh-1");

    expect(page.data[0].event_type).toBe("work_item.created");
  });

  it("retrieves one log by id, scoped under its webhook", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/webhook-logs/wh-1/log-1/")
      .reply(200, { id: "log-1", webhook_id: "wh-1", request_body: "{}", response_body: "{}" });

    const log = await makeLogs().retrieve(SLUG, "wh-1", "log-1");

    expect(log.request_body).toBe("{}");
  });

  it("percent-encodes the webhook id in the URL", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/webhook-logs/wh%2Fslash/")
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeLogs().list(SLUG, "wh/slash");

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeLogs().list(SLUG, "wh-1", { order_by: "webhook_id" as never })).rejects.toThrow(
      /Unknown order_by 'webhook_id' for webhook_logs_list/
    );
  });

  it("iterates across pages", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/webhook-logs/wh-1/")
      .query({ per_page: 1 })
      .reply(200, { data: [{ id: "log-1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get("/api/v2/workspaces/acme/webhook-logs/wh-1/")
      .query({ per_page: 1, offset: 1 })
      .reply(200, { data: [{ id: "log-2" }], pagination: { style: "offset" }, next: null });

    const ids: string[] = [];
    for await (const row of makeLogs().iterate(SLUG, "wh-1", { per_page: 1 })) {
      ids.push(row.id);
    }

    expect(ids).toEqual(["log-1", "log-2"]);
  });
});
