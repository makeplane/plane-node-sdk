import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkspaceWorkItems } from "../../../src/api/v2/WorkspaceWorkItems";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeWorkspaceWorkItems = () =>
  new WorkspaceWorkItems(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("WorkspaceWorkItems (v2)", () => {
  it("lists across the whole workspace, at a different path than the project-scoped list", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/work-items/")
      .query({ priority: "urgent" })
      .reply(200, { data: [{ id: "1" }, { id: "2" }], pagination: { style: "offset" } });

    const page = await makeWorkspaceWorkItems().list("acme", { priority: "urgent" });

    expect(scope.isDone()).toBe(true);
    expect(page.data).toHaveLength(2);
  });

  it("iterates across the whole workspace, following pages", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/work-items/")
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get("/api/v2/workspaces/acme/work-items/")
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "2" }], pagination: { style: "offset" }, next: null });

    const seen: string[] = [];
    for await (const row of makeWorkspaceWorkItems().iterate("acme")) seen.push(row.id);

    expect(seen).toEqual(["1", "2"]);
  });

  it("rejects an unknown expand value before making the request", async () => {
    await expect(makeWorkspaceWorkItems().list("acme", { expand: ["nope" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for workspace_work_items_list: nope/
    );
  });

  it("looks a work item up by its human-readable identifier (ENG-12), not its id", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/work-items/ENG-12/")
      .reply(200, { id: "uuid-1", identifier: "ENG-12", sequence_id: 12 });

    const found = await makeWorkspaceWorkItems().retrieveByIdentifier("acme", "ENG-12");

    expect(scope.isDone()).toBe(true);
    expect(found.identifier).toBe("ENG-12");
    expect(found.id).toBe("uuid-1");
  });

  it("retrieveByIdentifier is a different path than the workspace list, even for a colliding string", async () => {
    // "ENG-12" is not a uuid — proves this hits .../work-items/{identifier}/, not
    // some other route sharing the same prefix.
    const identifierScope = nock(BASE).get("/api/v2/workspaces/acme/work-items/ENG-12/").reply(200, { id: "1" });
    const listScope = nock(BASE)
      .get("/api/v2/workspaces/acme/work-items/")
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    await makeWorkspaceWorkItems().retrieveByIdentifier("acme", "ENG-12");
    await makeWorkspaceWorkItems().list("acme");

    expect(identifierScope.isDone()).toBe(true);
    expect(listScope.isDone()).toBe(true);
  });
});
