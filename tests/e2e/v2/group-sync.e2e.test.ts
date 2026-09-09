/**
 * Group-sync is EE-gated: an unlicensed workspace answers 402 `payment_required` to every
 * route here, which the capability gate turns into an announced sit-out rather than a failure.
 */
import { useCapability } from "./support/capability";
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("GroupSync (v2, live)", () => {
  const suite = useV2Project("groupsync", env);
  // Flat: `groupSync` is a grouping node — it consumes no path id itself, so it is never
  // a navigation property on a row and each child takes the slug per call.
  const groupSync = () => suite.client.v2.workspaces.groupSync;
  const slug = () => suite.workspaceSlug;
  const capability = useCapability("FeatureFlag.IDP_GROUP_SYNC is not enabled for this workspace");

  capability.it("reads the workspace config singleton", async () => {
    const config = await groupSync().config.retrieve(slug());
    expect(config.id).toBeTruthy();
  });

  capability.it("creates, retrieves, updates, then deletes a project mapping", async () => {
    let createdId: string | undefined;
    try {
      const created = await groupSync().projectMappings.create(slug(), {
        idp_group_name: `sdk-e2e-${Date.now()}`,
        role_slug: "member",
        project_id: suite.projectId,
      });
      createdId = created.id;

      const retrieved = await groupSync().projectMappings.retrieve(slug(), created.id);
      expect(retrieved.project_id).toBe(suite.projectId);

      const updated = await groupSync().projectMappings.update(slug(), created.id, {
        role_slug: "admin",
      });
      expect(updated.role_slug).toBe("admin");
    } finally {
      if (createdId) {
        await groupSync()
          .projectMappings.delete(slug(), createdId)
          .catch(() => undefined);
      }
    }
  });

  capability.it("creates, lists, then deletes a workspace mapping", async () => {
    let createdId: string | undefined;
    try {
      const idpGroupName = `sdk-e2e-ws-${Date.now()}`;
      const created = await groupSync().workspaceMappings.create(slug(), {
        idp_group_name: idpGroupName,
        role_slug: "member",
      });
      createdId = created.id;

      const page = await groupSync().workspaceMappings.list(slug(), {
        search: idpGroupName,
      });
      expect(page.data.some((mapping) => mapping.id === created.id)).toBe(true);
    } finally {
      if (createdId) {
        await groupSync()
          .workspaceMappings.delete(slug(), createdId)
          .catch(() => undefined);
      }
    }
  });
});
