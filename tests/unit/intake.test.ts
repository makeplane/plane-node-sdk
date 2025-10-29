import { PlaneClient } from "../../src/client/plane-client";
import { IntakeWorkItem } from "../../src/models/Intake";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Intake API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let intakeWorkItem: IntakeWorkItem;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;

    // Enable intake view if not already enabled
    await client.projects.update(workspaceSlug, projectId, {
      intake_view: true,
    });
  });

  afterAll(async () => {
    // Clean up created intake work item
    if (intakeWorkItem?.issue) {
      try {
        await client.intake.delete(workspaceSlug, projectId, intakeWorkItem.issue);
      } catch (error) {
        console.warn("Failed to delete intake work item:", error);
      }
    }
  });

  it("should create an intake work item", async () => {
    intakeWorkItem = await client.intake.create(workspaceSlug, projectId, {
      issue: {
        name: randomizeName("Test Intake"),
        description_html: "<p>Test Intake Description</p>",
      },
    });

    expect(intakeWorkItem).toBeDefined();
    expect(intakeWorkItem.id).toBeDefined();
    expect(intakeWorkItem.issue).toBeDefined();
  });

  it("should retrieve an intake work item", async () => {
    const retrievedIntake = await client.intake.retrieve(workspaceSlug, projectId, intakeWorkItem.issue!);

    expect(retrievedIntake).toBeDefined();
    expect(retrievedIntake.id).toBe(intakeWorkItem.id);
    expect(retrievedIntake.issue).toBe(intakeWorkItem.issue);
  });

  it("should update an intake work item", async () => {
    const updatedIntake = await client.intake.update(workspaceSlug, projectId, intakeWorkItem.issue!, {
      issue: {
        name: "Updated Test Intake",
        description_html: "<p>Updated Test Intake Description</p>",
      },
    });

    expect(updatedIntake).toBeDefined();
    expect(updatedIntake.id).toBe(intakeWorkItem.id);
  });

  it("should list intake work items", async () => {
    const intakes = await client.intake.list(workspaceSlug, projectId);

    expect(intakes).toBeDefined();
    expect(Array.isArray(intakes.results)).toBe(true);
    expect(intakes.results.length).toBeGreaterThan(0);

    const foundIntake = intakes.results.find((i) => i.id === intakeWorkItem.id);
    expect(foundIntake).toBeDefined();
  });
});
