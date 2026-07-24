import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItem, WorkItemRelationDefinition } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(
  !!(config.workspaceSlug && config.projectId && config.workItemId),
  "Work Item Custom Relations API Tests",
  () => {
    let client: PlaneClient;
    let workspaceSlug: string;
    let projectId: string;
    let workItemId: string;
    let targetWorkItem: WorkItem;
    let relationDefinition: WorkItemRelationDefinition;

    beforeAll(async () => {
      client = createTestClient();
      workspaceSlug = config.workspaceSlug;
      projectId = config.projectId;
      workItemId = config.workItemId;

      targetWorkItem = await client.workItems.create(workspaceSlug, projectId, {
        name: randomizeName("Custom Relation Target"),
      });

      relationDefinition = await client.workItemRelationDefinitions.create(workspaceSlug, {
        name: randomizeName("Implements "),
        outward: randomizeName("implements "),
        inward: randomizeName("implemented by "),
        is_active: true,
      });
    });

    afterAll(async () => {
      if (targetWorkItem?.id) {
        try {
          await client.workItems.delete(workspaceSlug, projectId, targetWorkItem.id);
        } catch (error) {
          console.warn("Failed to delete target work item:", error);
        }
      }
      if (relationDefinition?.id) {
        try {
          await client.workItemRelationDefinitions.del(workspaceSlug, relationDefinition.id);
        } catch (error) {
          console.warn("Failed to delete relation definition:", error);
        }
      }
    });

    it("should create a custom relation", async () => {
      const created = await client.workItems.customRelations.create(workspaceSlug, projectId, workItemId, {
        relation_definition_id: relationDefinition.id!,
        relation_definition_type: relationDefinition.outward!,
        work_item_ids: [targetWorkItem.id],
      });

      expect(Array.isArray(created)).toBe(true);
    });

    it("should list custom relations grouped by definition label", async () => {
      const relations = await client.workItems.customRelations.list(workspaceSlug, projectId, workItemId);

      expect(relations).toBeDefined();
      expect(typeof relations).toBe("object");
      const allRelated = Object.values(relations).flat();
      expect(allRelated.find((w) => w.id === targetWorkItem.id)).toBeDefined();
    });

    it("should remove a custom relation", async () => {
      await expect(
        client.workItems.customRelations.remove(workspaceSlug, projectId, workItemId, targetWorkItem.id)
      ).resolves.toBeUndefined();

      const relations = await client.workItems.customRelations.list(workspaceSlug, projectId, workItemId);
      const allRelated = Object.values(relations).flat();
      expect(allRelated.find((w) => w.id === targetWorkItem.id)).toBeUndefined();
    });
  }
);
