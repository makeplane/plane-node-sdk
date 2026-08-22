/**
 * WorkspacePermissions/ProjectPermissions each expose one GET-only singleton, with no `{pk}`.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { ProjectPermissions, WorkspacePermissions } from "../../../src/api/v2/Permissions";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

afterEach(() => nock.cleanAll());

describe("WorkspacePermissions (v2)", () => {
  const make = () => new WorkspacePermissions(makeTransport(), { slug: "acme" });

  it("gets the caller's effective permissions at the workspace level", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/permissions/me/")
      .reply(200, { permission_grants: ["work_item:create"], relation: "admin" });

    const perms = await make().me();

    expect(scope.isDone()).toBe(true);
    expect(perms.relation).toBe("admin");
  });

  it("has no list/create/update/delete — this is a read-only singleton", () => {
    const permissions = make() as unknown as Record<string, unknown>;
    expect(permissions.list).toBeUndefined();
    expect(permissions.create).toBeUndefined();
    expect(permissions.update).toBeUndefined();
    expect(permissions.delete).toBeUndefined();
  });
});

describe("ProjectPermissions (v2)", () => {
  const make = () => new ProjectPermissions(makeTransport(), { slug: "acme", project_id: "ENG" });

  it("gets the caller's effective permissions for one project — a differently-shaped path", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/permissions/me/")
      .reply(200, { permission_grants: [], relation: null });

    const perms = await make().me();

    expect(scope.isDone()).toBe(true);
    expect(perms.relation).toBeNull();
  });

  it("has no list/create/update/delete — this is a read-only singleton", () => {
    const permissions = make() as unknown as Record<string, unknown>;
    expect(permissions.list).toBeUndefined();
    expect(permissions.create).toBeUndefined();
    expect(permissions.update).toBeUndefined();
    expect(permissions.delete).toBeUndefined();
  });
});
