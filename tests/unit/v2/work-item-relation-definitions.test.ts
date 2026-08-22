import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkItemRelationDefinitions } from "../../../src/api/v2/WorkItemRelationDefinitions";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { NoMatchFoundError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";

const makeResource = () =>
  new WorkItemRelationDefinitions(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
  });

afterEach(() => nock.cleanAll());

describe("WorkItemRelationDefinitions (v2)", () => {
  it("lists relation definitions", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/work-item-relation-definitions/")
      .reply(200, {
        data: [{ id: "1", name: "Blocks", inward: "blocked by", outward: "blocks", is_default: true }],
        pagination: { style: "offset" },
      });

    const page = await makeResource().list();

    expect(page.data[0].is_default).toBe(true);
  });

  it("creates then patches", async () => {
    const body = { name: "Duplicates", inward: "is duplicated by", outward: "duplicates" };
    nock(BASE)
      .post("/api/v2/workspaces/acme/work-item-relation-definitions/", body)
      .reply(201, { id: "1", ...body, is_default: false });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/work-item-relation-definitions/1/", { color: "#00f" })
      .reply(200, { id: "1", ...body, color: "#00f" });

    const resource = makeResource();
    const created = await resource.create(body);
    expect(created.is_default).toBe(false);

    const updated = await resource.update(created.id, { color: "#00f" });
    expect(updated.color).toBe("#00f");
  });

  it("retrieves and deletes", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/work-item-relation-definitions/1/")
      .reply(200, { id: "1", name: "Duplicates" });
    const deleteScope = nock(BASE).delete("/api/v2/workspaces/acme/work-item-relation-definitions/1/").reply(204);

    const fetched = await makeResource().retrieve("1");
    expect(fetched.name).toBe("Duplicates");

    await expect(makeResource().delete("1")).resolves.toBeUndefined();
    expect(deleteScope.isDone()).toBe(true);
  });

  it("has no order_by option — the golden gives this operation none", async () => {
    // `work_item_relation_definitions_list` has no ORDER_BY entry at all, so
    // `encodeOrderBy` takes its "unknown operation id" branch, not "unknown value".
    await expect(makeResource().list({ order_by: "-created_at" } as never)).rejects.toThrow(
      /Unknown operation id 'work_item_relation_definitions_list'; cannot validate the order_by parameter/
    );
  });

  describe("findByName()", () => {
    it("scans client-side for the one exact match, with no ?name= on the request", async () => {
      const scope = nock(BASE)
        .get("/api/v2/workspaces/acme/work-item-relation-definitions/")
        .query((actual) => !("name" in actual))
        .reply(200, {
          data: [
            { id: "1", name: "Blocks", inward: "blocked by", outward: "blocks" },
            { id: "2", name: "Blocks Softly", inward: "softly blocked by", outward: "softly blocks" },
          ],
          pagination: { style: "offset" },
        });

      const found = await makeResource().findByName("Blocks");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("1");
    });

    it("throws NoMatchFoundError when nothing matches", async () => {
      nock(BASE)
        .get("/api/v2/workspaces/acme/work-item-relation-definitions/")
        .reply(200, {
          data: [{ id: "1", name: "Blocks" }],
          pagination: { style: "offset" },
        });

      await expect(makeResource().findByName("Nope")).rejects.toBeInstanceOf(NoMatchFoundError);
    });
  });
});
