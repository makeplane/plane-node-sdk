import { PlaneClient } from '../../src/client/plane-client';
import { config } from '../constants';

export async function testActivities() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;

  const activityResponse = await listActivities(
    client,
    workspaceSlug,
    projectId,
    workItemId
  );
  console.log(activityResponse);

  const activity = await retrieveActivity(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    activityResponse.results[0].id
  );
  console.log(activity);
}

async function listActivities(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  const activities = await client.workItems.activities.list(
    workspaceSlug,
    projectId,
    workItemId
  );
  return activities;
}

async function retrieveActivity(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  activityId: string
) {
  const activity = await client.workItems.activities.retrieve(
    workspaceSlug,
    projectId,
    workItemId,
    activityId
  );
  return activity;
}

if (require.main === module) {
  testActivities().catch(console.error);
}
