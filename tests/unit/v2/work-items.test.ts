import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkItems } from "../../../src/api/v2/WorkItems";
import { WorkItemField } from "../../../src/api/v2/generated/constants";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeWorkItems = () =>
  new WorkItems(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("WorkItems (v2)", () => {
  it("lists work items", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/")
      .reply(200, { data: [{ id: "1", name: "Fix bug" }], pagination: { style: "offset" } });

    const page = await makeWorkItems().list();

    expect(page.data[0].name).toBe("Fix bug");
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/")
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    const dynamicFields: WorkItemField[] = ["id"];
    const page = await makeWorkItems().list({ fields: dynamicFields });

    expect(page.data[0].id).toBe("1");
    expect(page.data[0].name).toBeUndefined();
  });

  it("narrows the row type when fields is a literal tuple", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/")
      .query({ fields: "id,name" })
      .reply(200, { data: [{ id: "1", name: "Fix bug" }], pagination: { style: "offset" } });

    const page = await makeWorkItems().list({ fields: ["id", "name"] as const });
    const row = page.data[0];

    expect(row.name).toBe("Fix bug");
    // @ts-expect-error `priority` was not requested, so it is not on the narrowed type
    expect(row.priority).toBeUndefined();
  });

  it("encodes expand into the query", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/abc/")
      .query({ expand: "state,assignees" })
      .reply(200, { id: "abc" });

    await makeWorkItems().retrieve("abc", { expand: ["state", "assignees"] });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown expand value before making the request", async () => {
    await expect(makeWorkItems().list({ expand: ["nope" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for work_items_list: nope/
    );
  });

  it("creates with the readable state/labels/assignees forms", async () => {
    const write = { name: "Fix bug", state: "Todo", labels: ["bug"], assignees: ["dev@example.com"] };
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-items/", write)
      .reply(201, { id: "1", name: "Fix bug" });

    const created = await makeWorkItems().create(write);

    expect(scope.isDone()).toBe(true);
    expect(created.id).toBe("1");
  });

  it("patches with PATCH", async () => {
    const scope = nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/work-items/1/", { name: "Renamed" })
      .reply(200, { id: "1", name: "Renamed" });

    await makeWorkItems().update("1", { name: "Renamed" });

    expect(scope.isDone()).toBe(true);
  });

  it("deletes without a body", async () => {
    nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/work-items/1/").reply(204);

    await expect(makeWorkItems().delete("1")).resolves.toBeUndefined();
  });

  it("upserts", async () => {
    const write = { name: "Fix bug", external_id: "ext-1", external_source: "jira" };
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-items/upsert/", write)
      .reply(200, { id: "1", name: "Fix bug" });

    await makeWorkItems().upsert(write);

    expect(scope.isDone()).toBe(true);
  });

  it("bulk-creates, bulk-updates, and bulk-deletes", async () => {
    const createScope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-items/bulk-create/", {
        items: [{ name: "A" }],
        all_or_none: false,
      })
      .reply(200, { results: [{ index: 0, result: "created", id: "1" }], succeeded: 1, failed: 0 });
    const updateScope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-items/bulk-update/", {
        items: [{ id: "1", name: "B" }],
        all_or_none: false,
      })
      .reply(200, { results: [{ index: 0, result: "updated", id: "1" }], succeeded: 1, failed: 0 });
    const deleteScope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-items/bulk-delete/", { ids: ["1"], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "deleted", id: "1" }], succeeded: 1, failed: 0 });

    const workItems = makeWorkItems();
    await workItems.bulkCreate([{ name: "A" }]);
    await workItems.bulkUpdate([{ id: "1", name: "B" }]);
    await workItems.bulkDelete(["1"]);

    expect(createScope.isDone()).toBe(true);
    expect(updateScope.isDone()).toBe(true);
    expect(deleteScope.isDone()).toBe(true);
  });

  it("archives and unarchives", async () => {
    const archiveScope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-items/1/archive/")
      .reply(200, { id: "1", archived_at: "2024-01-01T00:00:00Z" });
    const unarchiveScope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-items/1/unarchive/")
      .reply(200, { id: "1", archived_at: null });

    const workItems = makeWorkItems();
    const archived = await workItems.archive("1");
    const unarchived = await workItems.unarchive("1");

    expect(archiveScope.isDone()).toBe(true);
    expect(unarchiveScope.isDone()).toBe(true);
    expect(archived.archived_at).toBeTruthy();
    expect(unarchived.archived_at).toBeNull();
  });

  it("validates fields/expand on archive/unarchive the same as any other action", async () => {
    await expect(makeWorkItems().archive("1", { fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });
});
