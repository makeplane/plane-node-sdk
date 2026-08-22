import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Intakes } from "../../../src/api/v2/Intakes";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeResource = () =>
  new Intakes(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("Intakes (v2)", () => {
  it("lists intake work items for a project", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/intake-issues/")
      .query({ status: "-2" })
      .reply(200, {
        data: [{ id: "1", name: "Bug report", status: -2 }],
        pagination: { style: "offset" },
      });

    const page = await makeResource().list({ status: -2 });

    expect(page.data[0].status).toBe(-2);
  });

  it("creates then patches a triage decision in one call", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/intake-issues/", { name: "Bug report" })
      .reply(201, { id: "1", name: "Bug report", status: -2 });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/intake-issues/1/", { status: 1 })
      .reply(200, { id: "1", name: "Bug report", status: 1 });

    const resource = makeResource();
    const created = await resource.create({ name: "Bug report" });
    expect(created.status).toBe(-2);

    const updated = await resource.update(created.id, { status: 1 });
    expect(updated.status).toBe(1);
  });

  it("retrieves and deletes", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/intake-issues/1/").reply(200, { id: "1", name: "Bug report" });
    const deleteScope = nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/intake-issues/1/").reply(204);

    const fetched = await makeResource().retrieve("1");
    expect(fetched.name).toBe("Bug report");

    await expect(makeResource().delete("1")).resolves.toBeUndefined();
    expect(deleteScope.isDone()).toBe(true);
  });

  it("passes through a valid order_by", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/intake-issues/")
      .query({ order_by: "-created_at" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeResource().list({ order_by: "-created_at" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    // Proof this can actually fail: "priority" is a valid `fields` value for this
    // operation but not a listed `order_by` value.
    await expect(makeResource().list({ order_by: "priority" as never })).rejects.toThrow(
      /Unknown order_by 'priority' for intakes_list/
    );
  });
});
