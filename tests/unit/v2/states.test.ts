import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { States } from "../../../src/api/v2/States";
import { StateField } from "../../../src/api/v2/generated/constants";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeStates = () =>
  new States(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("States (v2)", () => {
  it("lists states", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(200, {
        data: [{ id: "1", name: "Todo", group: "unstarted" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeStates().list();

    expect(page.data[0].group).toBe("unstarted");
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    // Dynamic field list is typed as the widened `StateField[]`, so it falls back
    // to the full `State` return type.
    const dynamicFields: StateField[] = ["id"];
    const page = await makeStates().list({ fields: dynamicFields });

    expect(page.data[0].id).toBe("1");
    expect(page.data[0].name).toBeUndefined();
  });

  it("creates then patches", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/states/", { name: "Todo", color: "#fff" })
      .reply(201, { id: "1", name: "Todo", color: "#fff" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/states/1/", { name: "Doing" })
      .reply(200, { id: "1", name: "Doing" });

    const states = makeStates();
    const created = await states.create({ name: "Todo", color: "#fff" });
    const updated = await states.update(created.id, { name: "Doing" });

    expect(updated.name).toBe("Doing");
  });

  it("finds by name", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query(true)
      .reply(200, { data: [{ id: "1", name: "Todo" }], pagination: { style: "offset" } });

    expect((await makeStates().findByName("Todo")).id).toBe("1");
  });

  it("passes through a valid order_by", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ order_by: "-created_at" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeStates().list({ order_by: "-created_at" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    // "name" is a valid `fields` value but not a cursor-safe `order_by` for states —
    // the golden's own ORDER_BY["states_list"] excludes it (see generated/constants.ts).
    await expect(makeStates().list({ order_by: "name" as never })).rejects.toThrow(
      /Unknown order_by 'name' for states_list/
    );
  });

  it("throws a clear error when constructed with no scope", async () => {
    const states = new States(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

    await expect(states.list()).rejects.toThrow(/Missing path parameter 'slug'/);
  });
});
