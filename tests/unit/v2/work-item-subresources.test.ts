/**
 * Attachments/Links/WorkLogs/Activities share Comments' CRUD-over-V2Resource shape; Activities is read-only.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Activities, Attachments, Links, WorkLogs } from "../../../src/api/v2/WorkItems";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";
const WORK_ITEM = "wi-1";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const RESOURCE_SCOPE = { slug: SLUG, project_id: PROJECT };

afterEach(() => nock.cleanAll());

describe("WorkItems.attachments (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-items/${WORK_ITEM}/attachments/`;
  const make = () => new Attachments(makeTransport(), RESOURCE_SCOPE);

  it("lists, narrows fields, and rejects an unknown field", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "a1", name: "file.png", is_uploaded: true }], pagination: { style: "offset" } });
    const page = await make().list(WORK_ITEM);
    expect(page.data[0].name).toBe("file.png");

    await expect(make().list(WORK_ITEM, { fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });

  it("is a two-step upload: create returns credentials, update confirms is_uploaded", async () => {
    const createBody = { name: "file.png", size: 1024 };
    nock(BASE)
      .post(collection, createBody)
      .reply(201, { id: "a1", name: "file.png", is_uploaded: false, asset_url: "https://upload.example.com/a1" });
    nock(BASE).patch(`${collection}a1/`, { is_uploaded: true }).reply(200, { id: "a1", is_uploaded: true });
    nock(BASE).delete(`${collection}a1/`).reply(204);

    const attachments = make();
    const created = await attachments.create(WORK_ITEM, createBody);
    expect(created.is_uploaded).toBe(false);
    expect(created.asset_url).toBeTruthy();

    const confirmed = await attachments.update(WORK_ITEM, "a1", { is_uploaded: true });
    expect(confirmed.is_uploaded).toBe(true);

    await expect(attachments.delete(WORK_ITEM, "a1")).resolves.toBeUndefined();
  });

  it("retrieves one attachment", async () => {
    nock(BASE).get(`${collection}a1/`).reply(200, { id: "a1" });
    expect((await make().retrieve(WORK_ITEM, "a1")).id).toBe("a1");
  });
});

describe("WorkItems.links (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-items/${WORK_ITEM}/links/`;
  const make = () => new Links(makeTransport(), RESOURCE_SCOPE);

  it("creates, retrieves, updates, deletes a link", async () => {
    const write = { url: "https://example.com", title: "Example" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "l1", ...write });
    nock(BASE)
      .get(`${collection}l1/`)
      .reply(200, { id: "l1", ...write });
    nock(BASE)
      .patch(`${collection}l1/`, { title: "Renamed" })
      .reply(200, { id: "l1", url: write.url, title: "Renamed" });
    nock(BASE).delete(`${collection}l1/`).reply(204);

    const links = make();
    const created = await links.create(WORK_ITEM, write);
    expect(created.id).toBe("l1");
    const fetched = await links.retrieve(WORK_ITEM, "l1");
    expect(fetched.url).toBe(write.url);
    const updated = await links.update(WORK_ITEM, "l1", { title: "Renamed" });
    expect(updated.title).toBe("Renamed");
    await expect(links.delete(WORK_ITEM, "l1")).resolves.toBeUndefined();
  });

  it("lists with a title/url filter", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ title: "Example" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await make().list(WORK_ITEM, { title: "Example" });
    expect(scope.isDone()).toBe(true);
  });
});

describe("WorkItems.worklogs (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-items/${WORK_ITEM}/worklogs/`;
  const make = () => new WorkLogs(makeTransport(), RESOURCE_SCOPE);

  it("creates, retrieves, updates, deletes a worklog", async () => {
    const write = { duration: 60, description: "Investigated" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "w1", ...write });
    nock(BASE)
      .get(`${collection}w1/`)
      .reply(200, { id: "w1", ...write });
    nock(BASE).patch(`${collection}w1/`, { duration: 90 }).reply(200, { id: "w1", duration: 90 });
    nock(BASE).delete(`${collection}w1/`).reply(204);

    const worklogs = make();
    const created = await worklogs.create(WORK_ITEM, write);
    expect(created.duration).toBe(60);
    const fetched = await worklogs.retrieve(WORK_ITEM, "w1");
    expect(fetched.description).toBe("Investigated");
    const updated = await worklogs.update(WORK_ITEM, "w1", { duration: 90 });
    expect(updated.duration).toBe(90);
    await expect(worklogs.delete(WORK_ITEM, "w1")).resolves.toBeUndefined();
  });

  it("encodes the logged_by expand", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ expand: "logged_by" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await make().list(WORK_ITEM, { expand: ["logged_by"] });
    expect(scope.isDone()).toBe(true);
  });

  it("rejects an expand value the operation doesn't offer", async () => {
    await expect(make().list(WORK_ITEM, { expand: ["actor" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for worklogs_list: actor/
    );
  });
});

describe("WorkItems.activities (v2, read-only)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-items/${WORK_ITEM}/activities/`;
  const make = () => new Activities(makeTransport(), RESOURCE_SCOPE);

  it("lists and retrieves, following pages via iterate", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, {
        data: [{ id: "act1", verb: "updated", field: "state" }],
        pagination: { style: "offset" },
        next: null,
      });
    const page = await make().list(WORK_ITEM);
    expect(page.data[0].verb).toBe("updated");

    nock(BASE).get(`${collection}act1/`).reply(200, { id: "act1", verb: "updated" });
    expect((await make().retrieve(WORK_ITEM, "act1")).id).toBe("act1");
  });

  it("iterates across pages", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get(collection)
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "2" }], pagination: { style: "offset" }, next: null });

    const seen: string[] = [];
    for await (const row of make().iterate(WORK_ITEM)) seen.push(row.id);
    expect(seen).toEqual(["1", "2"]);
  });

  it("has no create/update/delete methods (read-only)", () => {
    const activities = make() as unknown as Record<string, unknown>;
    expect(activities.create).toBeUndefined();
    expect(activities.update).toBeUndefined();
    expect(activities.delete).toBeUndefined();
  });
});
