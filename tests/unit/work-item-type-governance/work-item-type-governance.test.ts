import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemType } from "../../../src/models/WorkItemType";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!config.workspaceSlug, "WorkItemTypeGovernance API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let governed: boolean;
  let workspaceType: WorkItemType | undefined;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;

    const features = await client.workspace.retrieveFeatures(workspaceSlug);
    governed = !!features.states_owned_by_workspace;

    if (governed) {
      workspaceType = await client.workspaceWorkItemTypes.create(workspaceSlug, {
        name: randomizeName("Gov Type"),
      });
    }
  });

  afterAll(async () => {
    if (workspaceType?.id) {
      try {
        await client.workspaceWorkItemTypes.delete(workspaceSlug, workspaceType.id);
      } catch (error) {
        console.warn("Failed to delete workspace work item type:", error);
      }
    }
  });

  it("should retrieve default governance for a fresh type ('any', empty allowlist)", async () => {
    if (!governed || !workspaceType?.id) return;

    const governance = await client.workItemTypeGovernance.retrieve(workspaceSlug, workspaceType.id);
    expect(governance.mode).toBe("any");
    expect(governance.allowlist).toEqual([]);
  });

  it("should preview mode 'any' as a no-op", async () => {
    if (!governed || !workspaceType?.id) return;

    const preview = await client.workItemTypeGovernance.preview(workspaceSlug, workspaceType.id, { mode: "any" });
    expect(preview.total).toBe(0);
  });

  it("should list no pins for a fresh type", async () => {
    if (!governed || !workspaceType?.id) return;

    const pins = await client.workItemTypeGovernance.pins.list(workspaceSlug, workspaceType.id);
    expect(pins).toEqual([]);
  });

  it("should list the project-side type-workflow resolution", async () => {
    if (!governed || !config.projectId) return;

    const entries = await client.workItemTypeGovernance.projectWorkflows.list(workspaceSlug, config.projectId);
    expect(Array.isArray(entries)).toBe(true);
    for (const entry of entries) {
      expect(entry.type_id).toBeDefined();
      expect(["any", "constrained", "required", "pinned"]).toContain(entry.governance);
    }
  });
});
