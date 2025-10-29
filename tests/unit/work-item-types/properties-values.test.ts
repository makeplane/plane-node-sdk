import { PlaneClient } from "../../../src/client/plane-client";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(
  !!(config.workspaceSlug && config.projectId && config.workItemId && config.customTextPropertyId),
  "Work Item Property Values API Tests",
  () => {
    let client: PlaneClient;
    let workspaceSlug: string;
    let projectId: string;
    let workItemId: string;
    let propertyId: string;

    beforeAll(async () => {
      client = createTestClient();
      workspaceSlug = config.workspaceSlug;
      projectId = config.projectId;
      workItemId = config.workItemId;
      propertyId = config.customTextPropertyId;

      // Enable work item types if not already enabled
      await client.projects.update(workspaceSlug, projectId, {
        is_issue_type_enabled: true,
      });
    });

    it("should test complete work item property values workflow", async () => {
      // Create/update a work item property value
      const testValue = randomizeName("Test WI Property Value");
      const workItemPropertyValue = await client.workItemProperties.values.create(
        workspaceSlug,
        projectId,
        workItemId,
        propertyId,
        {
          values: [{ value: testValue }],
        }
      );

      expect(workItemPropertyValue).toBeDefined();

      // Retrieve the work item property value
      const retrievedWorkItemPropertyValue = await client.workItemProperties.values.retrieve(
        workspaceSlug,
        projectId,
        workItemId,
        propertyId
      );

      expect(retrievedWorkItemPropertyValue).toBeDefined();

      // List all work item property values for the work item
      const workItemPropertyValues = await client.workItemProperties.values.list(workspaceSlug, projectId, workItemId, {
        limit: 10,
        offset: 0,
      });

      expect(workItemPropertyValues).toBeDefined();
    });
  }
);
