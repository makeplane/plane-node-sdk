import { PlaneClient } from "../../../src/client/plane-client";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";
import { WorkItemRelationResponse } from "../../../src/models/WorkItemRelation";
describe(
  !!(config.workspaceSlug && config.projectId && config.workItemId && config.workItemId2),
  "Work Item Relations API Tests",
  () => {
    let client: PlaneClient;
    let workspaceSlug: string;
    let projectId: string;
    let workItemId: string;
    let workItemId2: string;
    let relatedWorkItemId: string;

    beforeAll(async () => {
      client = createTestClient();
      workspaceSlug = config.workspaceSlug;
      projectId = config.projectId;
      workItemId = config.workItemId;
      workItemId2 = config.workItemId2;

      // Get the actual work item ID from the identifier
      const workItem2 = await client.workItems.retrieveByIdentifier(workspaceSlug, workItemId2);
      relatedWorkItemId = workItem2.id!;
    });

    it("should create a relation", async () => {
      const relationData = await client.workItems.relations.create(workspaceSlug, projectId, workItemId, {
        relation_type: "blocking",
        issues: [relatedWorkItemId],
      });

      expect(relationData).toBeDefined();
    });

    it("should list relations", async () => {
      const relations = await client.workItems.relations.list(workspaceSlug, projectId, workItemId);

      expect(relations).toBeDefined();
      expect(relations.blocking).toContain(relatedWorkItemId);
    });

    it("should delete a relation", async () => {
      await client.workItems.relations.delete(workspaceSlug, projectId, workItemId, {
        related_issue: relatedWorkItemId,
      });

      const relations = await client.workItems.relations.list(workspaceSlug, projectId, workItemId);
      expect(relations.blocking).not.toContain(relatedWorkItemId);
    });
  }
);
