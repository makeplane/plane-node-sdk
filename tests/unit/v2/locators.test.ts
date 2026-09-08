import nock from "nock";
import { PlaneClient } from "../../../src/client/plane-client";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeClient = () => new PlaneClient({ baseUrl: BASE, apiKey: "secret" });

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

// Two shapes coexist while the variant-F migration runs: the flat tree, which each
// migrated family joins, and the `workspace(slug).project(key)` locator chain, which
// each migrated family leaves. This file pins both halves of that trade so a family
// cannot be half-moved — added to neither, or left on both.

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

describe("chain locators (Workspace/Project) — being retired", () => {
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

  it("Workspace still exposes every workspace-level family that has not migrated", () => {
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

  it("Project still exposes every project-level family that has not migrated", () => {
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

  it("drops each family the moment it goes flat, so neither shape is a stale copy", () => {
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

    await makeClient().v2.workspace("acme").project("ENG").cycles.list();

    expect(scope.isDone()).toBe(true);
  });
});
