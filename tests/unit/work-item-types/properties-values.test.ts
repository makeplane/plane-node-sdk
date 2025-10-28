import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemPropertyValues } from "../../../src/models/WorkItemProperty";
import { config } from "../constants";
import { createTestClient } from "../test-utils";

export async function testWorkItemPropertiesValues() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;
  const propertyId = config.customTextPropertyId;

  // enable work item types if didn't already
  await client.projects.update(workspaceSlug, projectId, {
    is_issue_type_enabled: true,
  });

  if (!workspaceSlug || !projectId || !workItemId || !propertyId) {
    console.error("workItemId and propertyId are required to test work item properties and values");
    return;
  }

  const workItemPropertyValue = await updateWorkItemPropertyValue(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    propertyId
  );
  console.log("Created work item property value: ", workItemPropertyValue);

  const retrievedWorkItemPropertyValue = await retrieveWorkItemPropertyValue(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    propertyId
  );
  console.log("Retrieved work item property value: ", retrievedWorkItemPropertyValue);

  const workItemPropertyValues = await listWorkItemPropertyValues(client, workspaceSlug, projectId, workItemId);
  console.log("Listed work item property values: ", workItemPropertyValues);
}

async function updateWorkItemPropertyValue(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  propertyId: string
): Promise<WorkItemPropertyValues> {
  const workItemPropertyValue = await client.workItemProperties.values.create(
    workspaceSlug,
    projectId,
    workItemId,
    propertyId,
    {
      values: [{ value: `Test WI Property Value ${new Date().getTime()}` }],
    }
  );
  return workItemPropertyValue;
}

async function retrieveWorkItemPropertyValue(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  propertyId: string
): Promise<WorkItemPropertyValues> {
  const workItemPropertyValue = await client.workItemProperties.values.retrieve(
    workspaceSlug,
    projectId,
    workItemId,
    propertyId
  );
  return workItemPropertyValue;
}

async function listWorkItemPropertyValues(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
): Promise<WorkItemPropertyValues> {
  const workItemPropertyValues = await client.workItemProperties.values.list(workspaceSlug, projectId, workItemId, {
    limit: 10,
    offset: 0,
  });
  return workItemPropertyValues;
}

if (require.main === module) {
  testWorkItemPropertiesValues().catch(console.error);
}
