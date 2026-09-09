import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Labels } from "../../../src/api/v2/Labels";
import { LabelField } from "../../../src/api/v2/generated/constants";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const COLLECTION = "/api/v2/workspaces/acme/projects/ENG/labels/";

const makeLabels = () => new Labels(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Labels (v2)", () => {
  it("lists labels", async () => {
    nock(BASE)
      .get(COLLECTION)
      .reply(200, {
        data: [{ id: "1", name: "Bug", color: "#fff" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeLabels().list("acme", "ENG");

    expect(page.data[0].name).toBe("Bug");
  });

  it("iterates every label across pages", async () => {
    nock(BASE)
      .get(COLLECTION)
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get(COLLECTION)
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "2" }], pagination: { style: "offset" }, next: null });

    const seen: string[] = [];
    for await (const label of makeLabels().iterate("acme", "ENG")) seen.push(label.id);

    expect(seen).toEqual(["1", "2"]);
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get(COLLECTION)
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    // Dynamic field list is typed as the widened `LabelField[]`, so it falls back
    // to the full `Label` return type.
    const dynamicFields: LabelField[] = ["id"];
    const page = await makeLabels().list("acme", "ENG", { fields: dynamicFields });

    expect(page.data[0].id).toBe("1");
    expect(page.data[0].name).toBeUndefined();
  });

  it("retrieves one label by id", async () => {
    nock(BASE).get(`${COLLECTION}1/`).reply(200, { id: "1", name: "Bug" });

    expect((await makeLabels().retrieve("acme", "ENG", "1")).name).toBe("Bug");
  });

  it("creates then patches", async () => {
    nock(BASE).post(COLLECTION, { name: "Bug" }).reply(201, { id: "1", name: "Bug" });
    nock(BASE).patch(`${COLLECTION}1/`, { name: "Bugfix" }).reply(200, { id: "1", name: "Bugfix" });

    const labels = makeLabels();
    const created = await labels.create("acme", "ENG", { name: "Bug" });
    const updated = await labels.update("acme", "ENG", created.id, { name: "Bugfix" });

    expect(updated.name).toBe("Bugfix");
  });

  it("deletes without a body", async () => {
    const scope = nock(BASE).delete(`${COLLECTION}1/`).reply(204);

    await makeLabels().delete("acme", "ENG", "1");

    expect(scope.isDone()).toBe(true);
  });

  it("upserts against the collection's upsert route", async () => {
    nock(BASE)
      .post(`${COLLECTION}upsert/`, { name: "Bug", external_id: "x", external_source: "jira" })
      .reply(200, { id: "1", name: "Bug" });

    const label = await makeLabels().upsert("acme", "ENG", { name: "Bug", external_id: "x", external_source: "jira" });

    expect(label.id).toBe("1");
  });

  it("routes each bulk action to its own sub-route", async () => {
    const created = nock(BASE)
      .post(`${COLLECTION}bulk-create/`, { items: [{ name: "Bug" }], all_or_none: false })
      .reply(200, { results: [], succeeded: 0, failed: 0 });
    const updated = nock(BASE)
      .post(`${COLLECTION}bulk-update/`, { items: [{ id: "1", name: "Bugfix" }], all_or_none: false })
      .reply(200, { results: [], succeeded: 0, failed: 0 });
    const deleted = nock(BASE)
      .post(`${COLLECTION}bulk-delete/`, { ids: ["1"], all_or_none: false })
      .reply(200, { results: [], succeeded: 0, failed: 0 });

    const labels = makeLabels();
    await labels.bulkCreate("acme", "ENG", [{ name: "Bug" }]);
    await labels.bulkUpdate("acme", "ENG", [{ id: "1", name: "Bugfix" }]);
    await labels.bulkDelete("acme", "ENG", ["1"]);

    expect([created.isDone(), updated.isDone(), deleted.isDone()]).toEqual([true, true, true]);
  });

  it("finds by name", async () => {
    nock(BASE)
      .get(COLLECTION)
      .query(true)
      .reply(200, { data: [{ id: "1", name: "Bug" }], pagination: { style: "offset" } });

    expect((await makeLabels().findByName("acme", "ENG", "Bug")).id).toBe("1");
  });

  it("passes through a valid order_by", async () => {
    const scope = nock(BASE)
      .get(COLLECTION)
      .query({ order_by: "-created_at" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeLabels().list("acme", "ENG", { order_by: "-created_at" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeLabels().list("acme", "ENG", { order_by: "nope" as never })).rejects.toThrow(
      /Unknown order_by 'nope' for labels_list/
    );
  });

  it("names the resource and the method when a leading id is empty", async () => {
    await expect(makeLabels().list("", "ENG")).rejects.toThrow(/Labels\.list\(\) needs the path id 'slug'/);
  });
});
