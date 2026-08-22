/**
 * Group-sync may be gated behind an EE feature flag/plan tier; a 402 `payment_required` there is expected, not a bug.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("GroupSync (v2, live)", () => {
  const suite = useV2Project("groupsync", env);
  const ws = () => suite.client.v2.workspace(suite.workspaceSlug);

  it("reads the workspace config singleton", async () => {
    try {
      const config = await ws().groupSync.config.get();
      expect(config.id).toBeTruthy();
    } catch (error) {
      if (error instanceof PlaneApiError && error.status === 402) return; // feature not enabled — expected on some plans
      throw error;
    }
  });

  it("creates, retrieves, updates, then deletes a project mapping", async () => {
    let createdId: string | undefined;
    try {
      const created = await ws().groupSync.projectMappings.create({
        idp_group_name: `sdk-e2e-${Date.now()}`,
        role_slug: "member",
        project_id: suite.projectId,
      });
      createdId = created.id;

      const retrieved = await ws().groupSync.projectMappings.retrieve(created.id);
      expect(retrieved.project_id).toBe(suite.projectId);

      const updated = await ws().groupSync.projectMappings.update(created.id, {
        role_slug: "admin",
      });
      expect(updated.role_slug).toBe("admin");
    } catch (error) {
      if (error instanceof PlaneApiError && error.status === 402) return;
      throw error;
    } finally {
      if (createdId) {
        await ws()
          .groupSync.projectMappings.delete(createdId)
          .catch(() => undefined);
      }
    }
  });

  it("creates, lists, then deletes a workspace mapping", async () => {
    let createdId: string | undefined;
    try {
      const idpGroupName = `sdk-e2e-ws-${Date.now()}`;
      const created = await ws().groupSync.workspaceMappings.create({
        idp_group_name: idpGroupName,
        role_slug: "member",
      });
      createdId = created.id;

      const page = await ws().groupSync.workspaceMappings.list({
        search: idpGroupName,
      });
      expect(page.data.some((mapping) => mapping.id === created.id)).toBe(true);
    } catch (error) {
      if (error instanceof PlaneApiError && error.status === 402) return;
      throw error;
    } finally {
      if (createdId) {
        await ws()
          .groupSync.workspaceMappings.delete(createdId)
          .catch(() => undefined);
      }
    }
  });
});
