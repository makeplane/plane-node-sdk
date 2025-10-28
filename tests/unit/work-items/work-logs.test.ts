import { PlaneClient } from "../../src/client/plane-client";
import { config } from "../constants";
import { createTestClient } from "../test-utils";

export async function testWorkLogs() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;

  await client.projects.update(workspaceSlug, projectId, {
    is_time_tracking_enabled: true,
  });

  const project = await client.projects.retrieve(workspaceSlug, projectId);

  console.log("Time tracking enabled: ", project.is_time_tracking_enabled);

  const workLog = await createWorkLog(
    client,
    workspaceSlug,
    projectId,
    workItemId
  );
  console.log("Created work log: ", workLog);

  const workLogs = await listWorkLogs(
    client,
    workspaceSlug,
    projectId,
    workItemId
  );
  console.log("Listed work logs: ", workLogs);

  const updatedWorkLog = await updateWorkLog(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    workLog.id
  );
  console.log("Updated work log: ", updatedWorkLog);

  await deleteWorkLog(client, workspaceSlug, projectId, workItemId, workLog.id);
  console.log("Deleted work log: ", workLog.id);
}

async function createWorkLog(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  return client.workItems.workLogs.create(
    workspaceSlug,
    projectId,
    workItemId,
    {
      duration: 30,
      description: "Test work log",
    }
  );
}

async function listWorkLogs(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  return client.workItems.workLogs.list(workspaceSlug, projectId, workItemId);
}

async function updateWorkLog(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  workLogId: string
) {
  return client.workItems.workLogs.update(
    workspaceSlug,
    projectId,
    workItemId,
    workLogId,
    {
      description: "Updated test work log",
    }
  );
}

async function deleteWorkLog(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  workLogId: string
) {
  return client.workItems.workLogs.delete(
    workspaceSlug,
    projectId,
    workItemId,
    workLogId
  );
}

if (require.main === module) {
  testWorkLogs().catch(console.error);
}
