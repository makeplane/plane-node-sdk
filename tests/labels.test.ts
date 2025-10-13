import { PlaneClient } from '../src/client/plane-client';
import { Label } from '../src/models/schema-types';
import { config } from './constants';

export async function testLabels() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  const labelObj = await createLabel(client, workspaceSlug, projectId);
  console.log('Created label: ', labelObj);

  const retrievedLabel = await retrieveLabel(
    client,
    workspaceSlug,
    projectId,
    labelObj.id
  );
  console.log('Retrieved label: ', retrievedLabel);

  const updatedLabel = await updateLabel(
    client,
    workspaceSlug,
    projectId,
    labelObj.id,
    labelObj
  );
  console.log('Updated label: ', updatedLabel);

  const labels = await listLabels(client, workspaceSlug, projectId);
  console.log('Listed labels: ', labels);

  await deleteLabel(client, workspaceSlug, projectId, labelObj.id);
  console.log('Label deleted: ', labelObj.id);
}

async function createLabel(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const label = await client.labels.create(workspaceSlug, projectId, {
    name: 'Test Label ' + new Date().toISOString(),
    description: 'Test Label Description',
  });
  return label;
}

async function retrieveLabel(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  labelId: string
) {
  const label = await client.labels.retrieve(workspaceSlug, projectId, labelId);
  return label;
}

async function updateLabel(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  labelId: string,
  label: Label
) {
  const updatedLabel = await client.labels.update(
    workspaceSlug,
    projectId,
    labelId,
    {
      description: 'Updated Test Label Description' + new Date().toISOString(),
    }
  );
  return updatedLabel;
}

async function deleteLabel(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  labelId: string
) {
  await client.labels.del(workspaceSlug, projectId, labelId);
}

async function listLabels(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const labels = await client.labels.list(workspaceSlug, projectId);
  return labels;
}

if (require.main === module) {
  testLabels().catch(console.error);
}
