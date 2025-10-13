import { PlaneClient } from '../src/client/plane-client';
import { PaginatedResponse } from '../src/models/common';
import { IntakeIssue } from '../src/models/schema-types';
import { config } from './constants';

export async function testIntake() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  // enable intake if didn't already
  const updatedProject = await client.projects.update(
    workspaceSlug,
    projectId,
    {
      intake_view: true,
    }
  );

  const intakeIssue = await createIntake(client, workspaceSlug, projectId);
  console.log('Created intake: ', intakeIssue);

  const retrievedIntake = await retrieveIntake(
    client,
    workspaceSlug,
    projectId,
    intakeIssue.issue!
  );
  console.log('Retrieved intake: ', retrievedIntake);

  const updatedIntake = await updateIntake(
    client,
    workspaceSlug,
    projectId,
    intakeIssue.issue!,
    intakeIssue
  );
  console.log('Updated intake: ', updatedIntake);

  const intakes = await listIntake(client, workspaceSlug, projectId);
  console.log('Listed intakes: ', intakes);

  await deleteIntake(client, workspaceSlug, projectId, intakeIssue.issue!);
  console.log('Intake deleted: ', intakeIssue.id);
}

async function createIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
): Promise<IntakeIssue> {
  const intake = await client.intake.create(workspaceSlug, projectId, {
    issue: {
      name: 'Test Intake',
      description_html: '<p>Test Intake Description</p>',
    },
  });
  return intake;
}

async function retrieveIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  intakeWorkItemId: string
): Promise<IntakeIssue> {
  const intake = await client.intake.retrieve(
    workspaceSlug,
    projectId,
    intakeWorkItemId
  );
  return intake;
}

async function listIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
): Promise<PaginatedResponse<IntakeIssue>> {
  const intakes = await client.intake.list(workspaceSlug, projectId);
  return intakes;
}

async function updateIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  intakeWorkItemId: string,
  intake: IntakeIssue
): Promise<IntakeIssue> {
  const updatedIntake = await client.intake.update(
    workspaceSlug,
    projectId,
    intakeWorkItemId,
    {
      issue: {
        name: 'Updated Test Intake',
        description_html: '<p>Updated Test Intake Description</p>',
      },
    }
  );
  return updatedIntake;
}

async function deleteIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  intakeWorkItemId: string
): Promise<void> {
  await client.intake.del(workspaceSlug, projectId, intakeWorkItemId);
}

if (require.main === module) {
  testIntake().catch(console.error);
}
