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

  /**
   * `create` was the one row-returning method on any `LoadsNavigableRows` subclass that
   * never went through `load()`, so a *created* webhook silently had no `.logs` while a
   * *retrieved* one did — the exact failure the kernel's own doc comment warns about
   * ("a method that returns a plain row instead silently loses navigation").
   *
   * No sweep could see it. `loaded-navigation.test.ts` asks whether the resource is
   * navigable, and `Webhooks` is — through `list`, `iterate`, `retrieve`, `findByName`
   * and `update`. Only the one method was missing, and only a caller who created a
   * webhook and then reached for its logs would find out.
   */
  it("reaches the delivery log off a freshly created webhook too", async () => {
    nock(BASE)
      .post(`/api/v2/workspaces/${SLUG}/webhooks/`)
      .reply(201, { id: "w1", name: "Prod notifier", secret_key: "shhh" });
    const logs = nock(BASE)
      .get(`/api/v2/workspaces/${SLUG}/webhook-logs/w1/`)
      .reply(200, { data: [{ id: "log-1" }], pagination: { style: "offset" } });

    const created = await makeWebhooks().create(SLUG, { url: "https://example.com/hook" });
    const page = await created.logs.list();

    expect(logs.isDone()).toBe(true);
    expect(page.data[0].id).toBe("log-1");
  });

  it("a created webhook's navigation is non-enumerable, like every other loaded row", async () => {
    nock(BASE)
      .post(`/api/v2/workspaces/${SLUG}/webhooks/`)
      .reply(201, { id: "w1", name: "Prod notifier", secret_key: "shhh" });

    const created = await makeWebhooks().create(SLUG, { url: "https://example.com/hook" });

    expect(Object.keys(created).sort()).toEqual(["id", "name", "secret_key"]);
    expect(JSON.parse(JSON.stringify(created))).toEqual({
      id: "w1",
      name: "Prod notifier",
      secret_key: "shhh",
    });
  });
});

/**
 * The one-time secret has to survive a projection, and it is the write-projection
 * codemod that made this worth pinning.
 *
 * Giving `create` a narrowing overload nearly took `secret_key` away: `WebhookField` is
 * `FIELDS.webhooks_create`, which does **not** list `secret_key`, so
 * `Pick<WebhookCreateResponse, F | "id">` could never include it — and a caller who
 * projected a create would have lost, at compile time, the only copy of the secret the
 * call exists to hand back. The absence from that list is precisely what says the server
 * cannot be asked to drop it, so the narrowed row keeps it.
 */
describe("the webhook secret and `fields`", () => {
  it("keeps `secret_key` on a projected create", async () => {
    const scope = nock(BASE)
      .post(`/api/v2/workspaces/${SLUG}/webhooks/`)
      .query({ fields: "id,name" })
      .reply(201, { id: "w1", name: "Prod notifier", secret_key: "shhh" });

    const created = await makeWebhooks().create(
      SLUG,
      { url: "https://example.com/hook" },
      { fields: ["id", "name"] as const }
    );

    // Both must type-check: the requested field, and the secret that is not projectable.
    expect([created.name, created.secret_key]).toEqual(["Prod notifier", "shhh"]);
    // (mutation-proof: dropping `| "secret_key"` from the overload makes the line above a
    // compile error naming the property.)
    // @ts-expect-error `url` was not requested, so the projection still applies to it
    expect(created.url).toBeUndefined();
    expect(scope.isDone()).toBe(true);
  });

  /**
   * ...and `$loaded.present` has to agree with the row.
   *
   * `loadRow` narrows presence to the caller's `fields` when one was given. Routing
   * `create` through `load` therefore had to add `secret_key` to that set explicitly:
   * otherwise a projected create would hand back a row carrying the secret while
   * `$loaded.present` reported it missing — the one field the call exists to return.
   */
  it("reports `secret_key` as present on a projected create", async () => {
    nock(BASE)
      .post(`/api/v2/workspaces/${SLUG}/webhooks/`)
      .query({ fields: "id,name" })
      .reply(201, { id: "w1", name: "Prod notifier", secret_key: "shhh" });

    const created = await makeWebhooks().create(
      SLUG,
      { url: "https://example.com/hook" },
      { fields: ["id", "name"] as const }
    );

    expect([...created.$loaded.present].sort()).toEqual(["id", "name", "secret_key"]);
  });

  it("does not invent `secret_key` when the server did not send one", async () => {
    nock(BASE)
      .post(`/api/v2/workspaces/${SLUG}/webhooks/`)
      .query({ fields: "id,name" })
      .reply(201, { id: "w1", name: "Prod notifier" });

    const created = await makeWebhooks().create(
      SLUG,
      { url: "https://example.com/hook" },
      { fields: ["id", "name"] as const }
    );

    // Presence is what the response carried, intersected with what was asked for plus
    // the unprojectable secret — never a claim about a field that never arrived.
    expect([...created.$loaded.present].sort()).toEqual(["id", "name"]);
  });
});
