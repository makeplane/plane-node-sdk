/**
 * WorkspaceFeatures/ProjectFeatures are singletons: GET/PATCH land on the collection URL, no `{pk}`.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { ProjectFeatures, WorkspaceFeatures } from "../../../src/api/v2/Features";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

afterEach(() => nock.cleanAll());

describe("WorkspaceFeatures (v2)", () => {
  const make = () => new WorkspaceFeatures(makeTransport());

  it("retrieves at the bare collection URL, no id segment", async () => {
    const scope = nock(BASE).get("/api/v2/workspaces/acme/features/").reply(200, { id: "1", is_wiki_enabled: true });

    const feature = await make().retrieve("acme");

    expect(scope.isDone()).toBe(true);
    expect(feature.is_wiki_enabled).toBe(true);
  });

  it("patches at the bare collection URL", async () => {
    const scope = nock(BASE)
      .patch("/api/v2/workspaces/acme/features/", { is_wiki_enabled: false })
      .reply(200, { id: "1", is_wiki_enabled: false });

    const updated = await make().update("acme", { is_wiki_enabled: false });

    expect(scope.isDone()).toBe(true);
    expect(updated.is_wiki_enabled).toBe(false);
  });

  it("has no list/create/delete — this resource is a singleton", () => {
    const feature = make() as unknown as Record<string, unknown>;
    expect(feature.list).toBeUndefined();
    expect(feature.create).toBeUndefined();
    expect(feature.delete).toBeUndefined();
  });
});

describe("ProjectFeatures (v2)", () => {
  const make = () => new ProjectFeatures(makeTransport());

  it("retrieves at the bare project-scoped collection URL", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/features/")
      .reply(200, { is_epic_enabled: true });

    const feature = await make().retrieve("acme", "ENG");

    expect(scope.isDone()).toBe(true);
    expect(feature.is_epic_enabled).toBe(true);
  });

  it("patches at the bare project-scoped collection URL", async () => {
    const scope = nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/features/", { is_epic_enabled: false })
      .reply(200, { is_epic_enabled: false });

    const updated = await make().update("acme", "ENG", { is_epic_enabled: false });

    expect(scope.isDone()).toBe(true);
    expect(updated.is_epic_enabled).toBe(false);
  });
});
