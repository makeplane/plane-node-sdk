import nock from "nock";
import { PlaneClient } from "../../../src/client/plane-client";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeClient = () => new PlaneClient({ baseUrl: BASE, apiKey: "secret" });

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

// The flat tree is the surface; the `workspace(slug).project(key)` locator chain is
// deprecated and holds nothing the flat roots do not (`bands.test.ts` requires every
// resource whose URL puts it in a band to be on that band's root, derived from the URL
// templates rather than from these locators). The chain survives only because the e2e
// suite still calls it, and its call sites are a separate pass.
//
// So what this file pins is not "migrated implies gone from the locator" — it is that
// whatever the locator still hands back behaves the flat way, taking its ids per call and
// sharing the namespace's transport, so a caller on the old spelling gets the same
// requests as a caller on the new one.

describe("flat tree (v2)", () => {
  it("builds without making a single request", () => {
    const spy = jest.spyOn(V2Transport.prototype, "request");
    try {
      const v2 = makeClient().v2;

      expect(v2.projects).toBeDefined();
      expect(v2.projects.states).toBeDefined();
      expect(v2.projects.labels).toBeDefined();
      expect(v2.projects.workItems).toBeDefined();
      expect(v2.projects.workItems.comments).toBeDefined();
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("reaches a project-band resource by attribute access, taking its ids per call", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .matchHeader("X-Api-Key", "secret")
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeClient().v2.projects.states.list("acme", "ENG");

    expect(scope.isDone()).toBe(true);
  });

  it("reaches a work item's own children three levels down", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/wi-1/comments/")
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeClient().v2.projects.workItems.comments.list("acme", "ENG", "wi-1");

    expect(scope.isDone()).toBe(true);
  });
});

describe("chain locators (Workspace/Project) — deprecated, kept for the e2e call sites", () => {
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

  it("Workspace still hands back every workspace-level family an existing caller reaches", () => {
    const ws = makeClient().v2.workspace("acme");

    const expected = [
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

  it("Project still hands back every project-level family an existing caller reaches", () => {
    const proj = makeClient().v2.workspace("acme").project("ENG");

    const expected = [
      "cycles",
      "modules",
      "milestones",
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

  it("hand back resources that take their ids per call, binding or no binding", async () => {
    // A migrated resource reached through the locator ignores the bound slug and uses
    // the one it is passed — the locator is a holding pen at this point, not a scope.
    const scope = nock(BASE)
      .get("/api/v2/workspaces/other/roles/")
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeClient().v2.workspace("acme").roles.list("other");

    expect(scope.isDone()).toBe(true);
  });

  it("drops a family once the flat tree has somewhere to put it, so neither shape is a stale copy", () => {
    const v2 = makeClient().v2;
    const ws = v2.workspace("acme") as unknown as Record<string, unknown>;
    const proj = v2.workspace("acme").project("ENG") as unknown as Record<string, unknown>;

    // Migrated in task 1: reachable flat and from a fetched row, never off a locator.
    expect(ws.projects).toBeUndefined();
    expect(proj.states).toBeUndefined();
    expect(proj.labels).toBeUndefined();
    expect(proj.workItems).toBeUndefined();
  });

  it("Workspace.wiki exposes pages and collections", () => {
    const wiki = makeClient().v2.workspace("acme").wiki;

    expect(wiki.pages).toBeDefined();
    expect(wiki.collections).toBeDefined();
  });

  it("share one transport with the rest of v2 (same api key/base url)", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/cycles/")
      .matchHeader("X-Api-Key", "secret")
      .reply(200, { data: [], pagination: { style: "offset" } });

    // The ids are passed even though the locator bound them: `Cycles` is flat now, so the
    // locator is only a holder. What is still worth asserting is that what it holds shares
    // the namespace's transport — the locator does not build one of its own.
    await makeClient().v2.workspace("acme").project("ENG").cycles.list("acme", "ENG");

    expect(scope.isDone()).toBe(true);
  });
});
