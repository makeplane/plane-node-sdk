import { PlaneClient } from "../../src/client/plane-client";
import { PaginatedResponse } from "../../src/models/common";
import { WorkItemType } from "../../src/models/WorkItemType";
import { config } from "../constants";
import { createTestClient } from "../test-utils";

export async function testWorkItemTypes() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  // enable work item types if didn't already
  await client.projects.update(workspaceSlug, projectId, {
    is_issue_type_enabled: true,
  });

  const workItemType = await createWorkItemType(
    client,
    workspaceSlug,
    projectId
  );
  console.log("Created work item type: ", workItemType);

  const retrievedWorkItemType = await retrieveWorkItemType(
    client,
    workspaceSlug,
    projectId,
    workItemType.id
  );
  console.log("Retrieved work item type: ", retrievedWorkItemType);

  const updatedWorkItemType = await updateWorkItemType(
    client,
    workspaceSlug,
    projectId,
    workItemType.id
  );
  console.log("Updated work item type: ", updatedWorkItemType);

  const workItemTypes = await listWorkItemTypes(
    client,
    workspaceSlug,
    projectId
  );
  console.log("Listed work item types: ", workItemTypes);

  await deleteWorkItemType(client, workspaceSlug, projectId, workItemType.id);
  console.log("Work item type deleted: ", workItemType.id);
}

async function createWorkItemType(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
): Promise<WorkItemType> {
  const workItemType = await client.workItemTypes.create(
    workspaceSlug,
    projectId,
    {
      name: `Test WI Type ${new Date().getTime()}`,
    }
  );
  return workItemType;
}

async function retrieveWorkItemType(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemTypeId: string
): Promise<WorkItemType> {
  const workItemType = await client.workItemTypes.retrieve(
    workspaceSlug,
    projectId,
    workItemTypeId
  );
  return workItemType;
}

async function listWorkItemTypes(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
): Promise<PaginatedResponse<WorkItemType>> {
  const workItemTypes = await client.workItemTypes.list(
    workspaceSlug,
    projectId,
    {
      limit: 10,
      offset: 0,
    }
  );
  return workItemTypes;
}

async function updateWorkItemType(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemTypeId: string
): Promise<WorkItemType> {
  const updatedWorkItemType = await client.workItemTypes.update(
    workspaceSlug,
    projectId,
    workItemTypeId,
    {
      name: `Updated Test WI Type ${new Date().getTime()}`,
    }
  );
  return updatedWorkItemType;
}

async function deleteWorkItemType(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemTypeId: string
): Promise<void> {
  await client.workItemTypes.del(workspaceSlug, projectId, workItemTypeId);
}

if (require.main === module) {
  testWorkItemTypes().catch(console.error);
}
