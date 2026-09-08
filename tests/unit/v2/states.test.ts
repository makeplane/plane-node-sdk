import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { States } from "../../../src/api/v2/States";
import { StateField } from "../../../src/api/v2/generated/constants";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const COLLECTION = "/api/v2/workspaces/acme/projects/ENG/states/";

// Constructed with the transport alone — the flat shape: every call names the ids its
// URL needs, in path order.
const makeStates = () => new States(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("States (v2)", () => {
  it("lists states", async () => {
    nock(BASE)
      .get(COLLECTION)
      .reply(200, {
        data: [{ id: "1", name: "Todo", group: "unstarted" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeStates().list("acme", "ENG");

    expect(page.data[0].group).toBe("unstarted");
  });

  it("sends `group__in` as a comma-separated list", async () => {
    // The filter the query-filter sweep forced into existence: `states_list` declares
    // `?group__in=` (explode:false, style:form), and `ListStatesParams` omitted it, so
    // "states in any of these groups" was one request the SDK could not make at all.
    const scope = nock(BASE)
      .get(COLLECTION)
      .query({ group__in: "backlog,started" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeStates().list("acme", "ENG", { group__in: ["backlog", "started"] });

    expect(scope.isDone()).toBe(true);
  });

  it("iterates every state across pages", async () => {
    nock(BASE)
      .get(COLLECTION)
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get(COLLECTION)
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "2" }], pagination: { style: "offset" }, next: null });

    const seen: string[] = [];
    for await (const state of makeStates().iterate("acme", "ENG")) seen.push(state.id);

    expect(seen).toEqual(["1", "2"]);
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get(COLLECTION)
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    // Dynamic field list is typed as the widened `StateField[]`, so it falls back
    // to the full `State` return type.
    const dynamicFields: StateField[] = ["id"];
    const page = await makeStates().list("acme", "ENG", { fields: dynamicFields });

    expect(page.data[0].id).toBe("1");
    expect(page.data[0].name).toBeUndefined();
  });

  it("retrieves one state by id", async () => {
    nock(BASE).get(`${COLLECTION}1/`).reply(200, { id: "1", name: "Todo" });

    expect((await makeStates().retrieve("acme", "ENG", "1")).name).toBe("Todo");
  });

  it("creates then patches", async () => {
    nock(BASE).post(COLLECTION, { name: "Todo", color: "#fff" }).reply(201, { id: "1", name: "Todo", color: "#fff" });
    nock(BASE).patch(`${COLLECTION}1/`, { name: "Doing" }).reply(200, { id: "1", name: "Doing" });

    const states = makeStates();
    const created = await states.create("acme", "ENG", { name: "Todo", color: "#fff" });
    const updated = await states.update("acme", "ENG", created.id, { name: "Doing" });

    expect(updated.name).toBe("Doing");
  });

  it("deletes without a body", async () => {
    const scope = nock(BASE).delete(`${COLLECTION}1/`).reply(204);

    await makeStates().delete("acme", "ENG", "1");

    expect(scope.isDone()).toBe(true);
  });

  it("upserts against the collection's upsert route", async () => {
    nock(BASE)
      .post(`${COLLECTION}upsert/`, { name: "Todo", color: "#fff", external_id: "x", external_source: "jira" })
      .reply(200, { id: "1", name: "Todo" });

    const state = await makeStates().upsert("acme", "ENG", {
      name: "Todo",
      color: "#fff",
      external_id: "x",
      external_source: "jira",
    });

    expect(state.id).toBe("1");
  });

  it("routes each bulk action to its own sub-route", async () => {
    const created = nock(BASE)
      .post(`${COLLECTION}bulk-create/`, { items: [{ name: "Todo", color: "#fff" }], all_or_none: false })
      .reply(200, { results: [], succeeded: 0, failed: 0 });
    const updated = nock(BASE)
      .post(`${COLLECTION}bulk-update/`, { items: [{ id: "1", name: "Doing" }], all_or_none: true })
      .reply(200, { results: [], succeeded: 0, failed: 0 });
    const deleted = nock(BASE)
      .post(`${COLLECTION}bulk-delete/`, { ids: ["1"], all_or_none: false })
      .reply(200, { results: [], succeeded: 0, failed: 0 });

    const states = makeStates();
    await states.bulkCreate("acme", "ENG", [{ name: "Todo", color: "#fff" }]);
    await states.bulkUpdate("acme", "ENG", [{ id: "1", name: "Doing" }], true);
    await states.bulkDelete("acme", "ENG", ["1"]);

    expect([created.isDone(), updated.isDone(), deleted.isDone()]).toEqual([true, true, true]);
  });

  it("finds by name", async () => {
    nock(BASE)
      .get(COLLECTION)
      .query(true)
      .reply(200, { data: [{ id: "1", name: "Todo" }], pagination: { style: "offset" } });

    expect((await makeStates().findByName("acme", "ENG", "Todo")).id).toBe("1");
  });

  it("passes through a valid order_by", async () => {
    const scope = nock(BASE)
      .get(COLLECTION)
      .query({ order_by: "-created_at" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeStates().list("acme", "ENG", { order_by: "-created_at" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    // "name" is a valid `fields` value but not a cursor-safe `order_by` for states —
    // the golden's own ORDER_BY["states_list"] excludes it (see generated/constants.ts).
    await expect(makeStates().list("acme", "ENG", { order_by: "name" as never })).rejects.toThrow(
      /Unknown order_by 'name' for states_list/
    );
  });

  it("names the resource and the method when a leading id is empty", async () => {
    await expect(makeStates().list("acme", "")).rejects.toThrow(/States\.list\(\) needs the path id 'project_id'/);
  });
});
