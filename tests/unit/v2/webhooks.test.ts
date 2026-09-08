import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Webhooks } from "../../../src/api/v2/Webhooks";
import { WebhookLogs } from "../../../src/api/v2/WebhookLogs";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeWebhooks = () => new Webhooks(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Webhooks (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/webhooks/`;

  it("lists, retrieves, updates, deletes a webhook", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, {
        data: [{ id: "w1", url: "https://hooks.example.com", is_active: true }],
        pagination: { style: "offset" },
      });
    nock(BASE).get(`${collection}w1/`).reply(200, { id: "w1", url: "https://hooks.example.com" });
    nock(BASE).patch(`${collection}w1/`, { is_active: false }).reply(200, { id: "w1", is_active: false });
    nock(BASE).delete(`${collection}w1/`).reply(204);

    const webhooks = makeWebhooks();
    const page = await webhooks.list(SLUG);
    expect(page.data[0].is_active).toBe(true);
    const fetched = await webhooks.retrieve(SLUG, "w1");
    expect(fetched.url).toBe("https://hooks.example.com");
    const updated = await webhooks.update(SLUG, "w1", { is_active: false });
    expect(updated.is_active).toBe(false);
    await expect(webhooks.delete(SLUG, "w1")).resolves.toBeUndefined();
  });

  it("create returns secret_key once; list/retrieve never carry it", async () => {
    const write = { url: "https://hooks.example.com", scopes: ["work_item.created"] };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "w1", ...write, secret_key: "whsec_abc123" });
    nock(BASE).get(`${collection}w1/`).reply(200, { id: "w1", url: write.url });

    const webhooks = makeWebhooks();
    const created = await webhooks.create(SLUG, write);
    expect(created.secret_key).toBe("whsec_abc123");

    const fetched = await webhooks.retrieve(SLUG, "w1");
    expect((fetched as { secret_key?: string }).secret_key).toBeUndefined();
  });

  it("regenerate hits POST {pk}/regenerate/ and returns a fresh secret_key", async () => {
    const scope = nock(BASE).post(`${collection}w1/regenerate/`).reply(200, { id: "w1", secret_key: "whsec_new456" });

    const regenerated = await makeWebhooks().regenerate(SLUG, "w1");

    expect(scope.isDone()).toBe(true);
    expect(regenerated.secret_key).toBe("whsec_new456");
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeWebhooks().list(SLUG, { order_by: "url" as never })).rejects.toThrow(
      /Unknown order_by 'url' for webhooks_list/
    );
  });

  it("filters by is_active/url/search", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ is_active: "true", url: "hooks.example.com", search: "prod" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await makeWebhooks().list(SLUG, { is_active: true, url: "hooks.example.com", search: "prod" });
    expect(scope.isDone()).toBe(true);
  });

  it("exposes .logs as a sub-resource instance", () => {
    expect(makeWebhooks().logs).toBeInstanceOf(WebhookLogs);
  });

  it("finds by name", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ name: "Prod notifier", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "w1", name: "Prod notifier" }], pagination: { style: "offset" } });

    expect((await makeWebhooks().findByName(SLUG, "Prod notifier")).id).toBe("w1");
    expect(scope.isDone()).toBe(true);
  });
});

describe("navigable webhook rows (v2)", () => {
  it("reaches a fetched webhook's delivery log without repeating either id", async () => {
    nock(BASE).get(`/api/v2/workspaces/${SLUG}/webhooks/w1/`).reply(200, { id: "w1", name: "Prod notifier" });
    const logs = nock(BASE)
      .get(`/api/v2/workspaces/${SLUG}/webhook-logs/w1/`)
      .reply(200, { data: [{ id: "log-1" }], pagination: { style: "offset" } });

    const webhook = await makeWebhooks().retrieve(SLUG, "w1");
    const page = await webhook.logs.list();

    expect(logs.isDone()).toBe(true);
    expect(page.data[0].id).toBe("log-1");
  });
});
