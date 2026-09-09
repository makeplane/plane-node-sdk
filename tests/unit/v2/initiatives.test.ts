import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Initiatives } from "../../../src/api/v2/Initiatives";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeInitiatives = () => new Initiatives(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Initiatives (v2)", () => {
  it("lists initiatives", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/initiatives/")
      .reply(200, {
        data: [{ id: "init1", name: "Q3 Push", state: "ACTIVE" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeInitiatives().list(SLUG);

    expect(page.data[0].state).toBe("ACTIVE");
  });

  it("expands the lead on retrieve", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/initiatives/init1/")
      .query({ expand: "lead" })
      .reply(200, { id: "init1", name: "Q3 Push", lead_id: "user1", lead: { id: "user1" } });

    const initiative = await makeInitiatives().retrieve(SLUG, "init1", { expand: ["lead"] });

    expect((initiative as unknown as { lead: { id: string } }).lead.id).toBe("user1");
  });

  it("creates, patches and deletes an initiative", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/initiatives/", { name: "Q3 Push", project_ids: ["proj1"] })
      .reply(201, { id: "init1", name: "Q3 Push", project_ids: ["proj1"] });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/initiatives/init1/", { state: "COMPLETED" })
      .reply(200, { id: "init1", state: "COMPLETED" });
    nock(BASE).delete("/api/v2/workspaces/acme/initiatives/init1/").reply(204);

    const initiatives = makeInitiatives();
    const created = await initiatives.create(SLUG, { name: "Q3 Push", project_ids: ["proj1"] });
    expect(created.project_ids).toEqual(["proj1"]);

    const updated = await initiatives.update(SLUG, created.id, { state: "COMPLETED" });
    expect(updated.state).toBe("COMPLETED");

    await initiatives.delete(SLUG, created.id);
  });

  it("finds an initiative by name", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/initiatives/")
      .query(true)
      .reply(200, { data: [{ id: "init1", name: "Q3 Push" }], pagination: { style: "offset" } });

    expect((await makeInitiatives().findByName(SLUG, "Q3 Push")).id).toBe("init1");
  });

  it("rejects an unknown order_by before making the request", async () => {
    // "name" is a valid `fields` value but is not in workflows/initiatives_list's
    // ORDER_BY set (only created_at/id) — see generated/constants.ts.
    await expect(makeInitiatives().list(SLUG, { order_by: "name" as never })).rejects.toThrow(
      /Unknown order_by 'name' for initiatives_list/
    );
  });

  describe("bridge sub-resources", () => {
    it("adds projects via projects.add", async () => {
      const scope = nock(BASE)
        .post("/api/v2/workspaces/acme/initiatives/init1/projects/", { add: ["proj1"] })
        .reply(200, { added: ["proj1"] });

      const result = await makeInitiatives().projects.add(SLUG, "init1", ["proj1"]);

      expect(scope.isDone()).toBe(true);
      expect(result).toEqual(["proj1"]);
    });

    it("removes projects via projects.remove", async () => {
      const scope = nock(BASE)
        .post("/api/v2/workspaces/acme/initiatives/init1/projects/", { remove: ["proj1"] })
        .reply(200, { removed: ["proj1"] });

      const result = await makeInitiatives().projects.remove(SLUG, "init1", ["proj1"]);

      expect(scope.isDone()).toBe(true);
      expect(result).toEqual(["proj1"]);
    });

    it("adds work items via workItems.add", async () => {
      const scope = nock(BASE)
        .post("/api/v2/workspaces/acme/initiatives/init1/work-items/", { add: ["wi1"] })
        .reply(200, { added: ["wi1"] });

      const result = await makeInitiatives().workItems.add(SLUG, "init1", ["wi1"]);

      expect(scope.isDone()).toBe(true);
      expect(result).toEqual(["wi1"]);
    });

    it("removes labels via labels.remove", async () => {
      const scope = nock(BASE)
        .post("/api/v2/workspaces/acme/initiatives/init1/labels/", { remove: ["lbl1"] })
        .reply(200, { removed: ["lbl1"] });

      const result = await makeInitiatives().labels.remove(SLUG, "init1", ["lbl1"]);

      expect(scope.isDone()).toBe(true);
      expect(result).toEqual(["lbl1"]);
    });
  });

  describe("labels catalog", () => {
    it("is a workspace-level sibling collection, not nested under an initiative id", async () => {
      nock(BASE)
        .get("/api/v2/workspaces/acme/initiatives/labels/")
        .reply(200, { data: [{ id: "lbl1", name: "Strategic" }], pagination: { style: "offset" } });

      const page = await makeInitiatives().labels.list(SLUG);

      expect(page.data[0].name).toBe("Strategic");
    });

    it("creates, patches and deletes a label", async () => {
      nock(BASE)
        .post("/api/v2/workspaces/acme/initiatives/labels/", { name: "Strategic" })
        .reply(201, { id: "lbl1", name: "Strategic" });
      nock(BASE)
        .patch("/api/v2/workspaces/acme/initiatives/labels/lbl1/", { color: "#f00" })
        .reply(200, { id: "lbl1", name: "Strategic", color: "#f00" });
      nock(BASE).delete("/api/v2/workspaces/acme/initiatives/labels/lbl1/").reply(204);

      const labels = makeInitiatives().labels;
      const created = await labels.create(SLUG, { name: "Strategic" });
      const updated = await labels.update(SLUG, created.id, { color: "#f00" });
      expect(updated.color).toBe("#f00");

      await labels.delete(SLUG, created.id);
    });
  });
});

describe("navigable initiative rows (v2)", () => {
  it("reaches all three memberships of a fetched initiative", async () => {
    const base = `/api/v2/workspaces/${SLUG}/initiatives/init1`;
    nock(BASE).get(`${base}/`).reply(200, { id: "init1", name: "Q3" });
    const labels = nock(BASE)
      .post(`${base}/labels/`, { add: ["lbl1"] })
      .reply(200, { added: ["lbl1"] });
    const projects = nock(BASE)
      .post(`${base}/projects/`, { add: ["p1"] })
      .reply(200, { added: ["p1"] });
    const workItems = nock(BASE)
      .post(`${base}/work-items/`, { remove: ["wi1"] })
      .reply(200, { removed: ["wi1"] });

    const initiative = await makeInitiatives().retrieve(SLUG, "init1");
    await initiative.labels.add(["lbl1"]);
    await initiative.projects.add(["p1"]);
    await initiative.workItems.remove(["wi1"]);

    expect([labels.isDone(), projects.isDone(), workItems.isDone()]).toEqual([true, true, true]);
  });
});
