import { PlaneClient } from '../../src/client/plane-client';
import { WorkItem } from '../../src/models/WorkItem';
import { config } from '../constants';

export async function testWorkItems() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  const workItem = await createWorkItem(client, workspaceSlug, projectId);
  console.log('Created work item: ', workItem);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const retrievedWorkItem = await retrieveWorkItem(
    client,
    workspaceSlug,
    projectId,
    workItem.id
  );
  console.log('Retrieved work item: ', retrievedWorkItem);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const updatedWorkItem = await updateWorkItem(
    client,
    workspaceSlug,
    projectId,
    workItem.id,
    workItem
  );
  console.log('Updated work item: ', updatedWorkItem);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const workItems = await listWorkItems(client, workspaceSlug, projectId);
  console.log('Listed work items: ', workItems);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const workItemByIdentifier = await retrieveWorkItemByIdentifier(
    client,
    workspaceSlug,
    projectId,
    workItem.sequence_id!
  );
  console.log('Retrieved work item by identifier: ', workItemByIdentifier);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const searchedWorkItems = await searchWorkItems(
    client,
    workspaceSlug,
    projectId,
    workItemByIdentifier.name
  );
  console.log('Searched work items: ', searchedWorkItems);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await deleteWorkItem(client, workspaceSlug, projectId, workItem.id);
  console.log('Work item deleted: ', workItem.id);
}

async function createWorkItem(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const workItem = await client.workItems.create(workspaceSlug, projectId, {
    name: 'Test Work Item',
    description_html: '<p>A work item created via the Plane SDK</p>',
  });
  return workItem;
}

async function retrieveWorkItem(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  const workItem = await client.workItems.retrieve(
    workspaceSlug,
    projectId,
    workItemId
  );
  return workItem;
}

async function updateWorkItem(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  workItem: WorkItem
) {
  const states = await client.states.list(workspaceSlug, projectId);
  const labels = await client.labels.list(workspaceSlug, projectId);

  const label = labels.results[0];
  const state = states.results[0];

  const updatedWorkItem = await client.workItems.update(
    workspaceSlug,
    projectId,
    workItemId,
    {
      name: 'Updated Test Work Item',
      description_html: '<p>Updated Test Work Item Description</p>',
      state: state ? state.id : undefined,
      assignees: [config.userId],
      labels: label ? [label.id] : undefined,
    }
  );
  return updatedWorkItem;
}

async function listWorkItems(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const workItems = await client.workItems.list(workspaceSlug, projectId);
  return workItems;
}

async function deleteWorkItem(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  await client.workItems.del(workspaceSlug, projectId, workItemId);
}

async function retrieveWorkItemByIdentifier(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  identifier: number
) {
  const project = await client.projects.retrieve(workspaceSlug, projectId);
  const workItem = await client.workItems.retrieveByIdentifier(
    workspaceSlug,
    projectId,
    `${project.identifier}-${identifier}`
  );
  return workItem;
}

async function searchWorkItems(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  query: string
) {
  const workItems = await client.workItems.search(
    workspaceSlug,
    projectId,
    query
  );
  return workItems;
}

if (require.main === module) {
  testWorkItems().catch(console.error);
}
