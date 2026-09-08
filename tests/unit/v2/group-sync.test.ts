import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { GroupSyncConfigResource } from "../../../src/api/v2/GroupSync/Config";
import { GroupSyncProjectMappings } from "../../../src/api/v2/GroupSync/ProjectMappings";
import { GroupSyncWorkspaceMappings } from "../../../src/api/v2/GroupSync/WorkspaceMappings";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const transport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const makeConfig = () => new GroupSyncConfigResource(transport());
const makeProjectMappings = () => new GroupSyncProjectMappings(transport());
const makeWorkspaceMappings = () => new GroupSyncWorkspaceMappings(transport());

afterEach(() => nock.cleanAll());

describe("GroupSyncConfigResource (v2)", () => {
  it("gets the singleton config", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/group-sync/config/")
      .reply(200, { id: "1", is_enabled: true, group_attribute_key: "groups" });

    const config = await makeConfig().get("acme");

    expect(config.is_enabled).toBe(true);
    expect(config.group_attribute_key).toBe("groups");
  });

  it("patches the singleton config at the same URL, not a detail sub-path", async () => {
    const scope = nock(BASE)
      .patch("/api/v2/workspaces/acme/group-sync/config/", { is_enabled: false })
      .reply(200, { id: "1", is_enabled: false });

    const updated = await makeConfig().update("acme", { is_enabled: false });

    expect(scope.isDone()).toBe(true);
    expect(updated.is_enabled).toBe(false);
  });
});

describe("GroupSyncProjectMappings (v2)", () => {
  it("lists project mappings", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/group-sync/project-mappings/")
      .reply(200, {
        data: [{ id: "1", idp_group_name: "engineering", role_slug: "member", all_projects: false }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeProjectMappings().list("acme");

    expect(page.data[0].idp_group_name).toBe("engineering");
  });

  it("creates then patches a mapping", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/group-sync/project-mappings/", {
        idp_group_name: "engineering",
        role_slug: "member",
        project_id: "proj-1",
      })
      .reply(201, { id: "1", idp_group_name: "engineering", role_slug: "member", project_id: "proj-1" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/group-sync/project-mappings/1/", { role_slug: "admin" })
      .reply(200, { id: "1", role_slug: "admin" });

    const mappings = makeProjectMappings();
    const created = await mappings.create("acme", {
      idp_group_name: "engineering",
      role_slug: "member",
      project_id: "proj-1",
    });
    const updated = await mappings.update("acme", created.id, { role_slug: "admin" });

    expect(updated.role_slug).toBe("admin");
  });

  it("deletes a mapping", async () => {
    const scope = nock(BASE).delete("/api/v2/workspaces/acme/group-sync/project-mappings/1/").reply(204);

    await makeProjectMappings().delete("acme", "1");

    expect(scope.isDone()).toBe(true);
  });

  // No nock interceptor is registered for this URL, so the message-specific regex
  // pins the real validator, not just "any throw".
  it("rejects an unknown fields value before making the request", async () => {
    await expect(makeProjectMappings().list("acme", { fields: ["nope" as never] })).rejects.toThrow(
      /Unknown field\(s\) for group_sync_project_mappings_list/
    );
  });
});

describe("GroupSyncWorkspaceMappings (v2)", () => {
  it("lists workspace mappings", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/group-sync/workspace-mappings/")
      .reply(200, {
        data: [{ id: "1", idp_group_name: "everyone", role_slug: "member" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeWorkspaceMappings().list("acme");

    expect(page.data[0].idp_group_name).toBe("everyone");
  });

  it("creates then patches a mapping", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/group-sync/workspace-mappings/", {
        idp_group_name: "everyone",
        role_slug: "member",
      })
      .reply(201, { id: "1", idp_group_name: "everyone", role_slug: "member" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/group-sync/workspace-mappings/1/", { role_slug: "admin" })
      .reply(200, { id: "1", role_slug: "admin" });

    const mappings = makeWorkspaceMappings();
    const created = await mappings.create("acme", { idp_group_name: "everyone", role_slug: "member" });
    const updated = await mappings.update("acme", created.id, { role_slug: "admin" });

    expect(updated.role_slug).toBe("admin");
  });

  it("deletes a mapping", async () => {
    const scope = nock(BASE).delete("/api/v2/workspaces/acme/group-sync/workspace-mappings/1/").reply(204);

    await makeWorkspaceMappings().delete("acme", "1");

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeWorkspaceMappings().list("acme", { order_by: "role_slug" as never })).rejects.toThrow(
      /Unknown order_by 'role_slug' for group_sync_workspace_mappings_list/
    );
  });
});
