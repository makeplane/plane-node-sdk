import { PlaneClient } from "../../src/client/plane-client";
import { PaginatedResponse } from "../../src/models/common";
import { IntakeWorkItem } from "../../src/models/Intake";
import { config } from "./constants";
import { createTestClient } from "./test-utils";

export async function testIntake() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  if (!workspaceSlug || !projectId) {
    console.error("workspaceSlug and projectId are required");
    return;
  }

  // enable intake if didn't already
  const updatedProject = await client.projects.update(workspaceSlug, projectId, {
    intake_view: true,
  });

  const intakeWorkItem = await createIntake(client, workspaceSlug, projectId);
  console.log("Created intake: ", intakeWorkItem);

  const retrievedIntake = await retrieveIntake(client, workspaceSlug, projectId, intakeWorkItem.issue!);
  console.log("Retrieved intake: ", retrievedIntake);

  const updatedIntake = await updateIntake(client, workspaceSlug, projectId, intakeWorkItem.issue!, intakeWorkItem);
  console.log("Updated intake: ", updatedIntake);

  const intakes = await listIntake(client, workspaceSlug, projectId);
  console.log("Listed intakes: ", intakes);

  await deleteIntake(client, workspaceSlug, projectId, intakeWorkItem.issue!);
  console.log("Intake deleted: ", intakeWorkItem.id);
}

async function createIntake(client: PlaneClient, workspaceSlug: string, projectId: string): Promise<IntakeWorkItem> {
  const intake = await client.intake.create(workspaceSlug, projectId, {
    issue: {
      name: "Test Intake",
      description_html: "<p>Test Intake Description</p>",
    },
  });
  return intake;
}

async function retrieveIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  intakeWorkItemId: string
): Promise<IntakeWorkItem> {
  const intake = await client.intake.retrieve(workspaceSlug, projectId, intakeWorkItemId);
  return intake;
}

async function listIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
): Promise<PaginatedResponse<IntakeWorkItem>> {
  const intakes = await client.intake.list(workspaceSlug, projectId);
  return intakes;
}

async function updateIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  intakeWorkItemId: string,
  intake: IntakeWorkItem
): Promise<IntakeWorkItem> {
  const updatedIntake = await client.intake.update(workspaceSlug, projectId, intakeWorkItemId, {
    issue: {
      name: "Updated Test Intake",
      description_html: "<p>Updated Test Intake Description</p>",
    },
  });
  return updatedIntake;
}

async function deleteIntake(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  intakeWorkItemId: string
): Promise<void> {
  await client.intake.delete(workspaceSlug, projectId, intakeWorkItemId);
}

if (require.main === module) {
  testIntake().catch(console.error);
}
