import nock from "nock";
import { PlaneClient } from "../../../src/client/plane-client";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeClient = () => new PlaneClient({ baseUrl: BASE, apiKey: "secret" });

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

describe("chain locators (Workspace/Project)", () => {
  it("build the whole chain without making a single request", () => {
    const spy = jest.spyOn(V2Transport.prototype, "request");
    try {
      const client = makeClient();

      const ws = client.v2.workspace("acme");
      const proj = ws.project("ENG");

      expect(ws).toBeDefined();
      expect(proj).toBeDefined();
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("Workspace exposes every workspace-level attribute the plan calls for", () => {
    const ws = makeClient().v2.workspace("acme");

    const expected = [
      "projects",
      "members",
      "invitations",
      "roles",
      "permissionSchemes",
      "permissions",
      "features",
      "auditLogs",
      "views",
      "workItems",
      "workItemTypes",
      "workItemProperties",
      "workItemRelationDefinitions",
      "workItemTemplates",
      "groupSync",
      "automations",
      "assets",
      "artifacts",
      "webhooks",
      "stickies",
      "teamspaces",
      "customers",
      "customerProperties",
      "initiatives",
      "releases",
      "wiki",
    ];

    for (const attr of expected) {
      expect(ws).toHaveProperty(attr);
      expect((ws as unknown as Record<string, unknown>)[attr]).toBeDefined();
    }
    expect(typeof ws.project).toBe("function");
  });

  it("Project exposes every project-level attribute the plan calls for", () => {
    const proj = makeClient().v2.workspace("acme").project("ENG");

    const expected = [
      "workItems",
      "cycles",
      "modules",
      "milestones",
      "states",
      "labels",
      "members",
      "pages",
      "views",
      "features",
      "permissions",
      "intakes",
      "estimates",
      "workItemTypes",
      "workItemProperties",
      "workItemTemplates",
      "workflows",
      "automations",
      "worklogs",
    ];

    for (const attr of expected) {
      expect(proj).toHaveProperty(attr);
      expect((proj as unknown as Record<string, unknown>)[attr]).toBeDefined();
    }
  });

  it("Workspace.wiki exposes pages and collections", () => {
    const wiki = makeClient().v2.workspace("acme").wiki;

    expect(wiki.pages).toBeDefined();
    expect(wiki.collections).toBeDefined();
  });

  it("V2Namespace keeps only transport/users/userAssets/workspace at the top level", () => {
    const v2 = makeClient().v2 as unknown as Record<string, unknown>;

    expect(v2.transport).toBeDefined();
    expect(v2.users).toBeDefined();
    expect(v2.userAssets).toBeDefined();
    expect(typeof v2.workspace).toBe("function");

    // Every other resource that used to be flat on `v2` is gone — reachable only
    // through the chain now.
    expect(v2.states).toBeUndefined();
    expect(v2.labels).toBeUndefined();
    expect(v2.workItems).toBeUndefined();
    expect(v2.cycles).toBeUndefined();
    expect(v2.projects).toBeUndefined();
  });

  it("share one transport with the rest of v2 (same api key/base url)", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .matchHeader("X-Api-Key", "secret")
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeClient().v2.workspace("acme").project("ENG").states.list();

    expect(scope.isDone()).toBe(true);
  });
});
