import { PlaneClient } from "../../src/client/plane-client";
import { Milestone, UpdateMilestoneRequest, MilestoneWorkItem } from "../../src/models";
import { config } from "./constants";
import { createTestClient } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Milestone API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;
  let milestone: Milestone;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;
  });

  afterAll(async () => {
    // Clean up created resources
    if (milestone?.id) {
      try {
        await client.milestones.delete(workspaceSlug, projectId, milestone.id);
      } catch (error) {
        console.warn("Failed to delete milestone:", error);
      }
    }
  });

  it("should create a milestone", async () => {
    milestone = await client.milestones.create(workspaceSlug, projectId, {
      title: "Test Milestone",
    });

    expect(milestone).toBeDefined();
    expect(milestone.id).toBeDefined();
    expect(milestone.title).toBe("Test Milestone");
  });

  it("should retrieve a milestone", async () => {
    const retrievedMilestone = await client.milestones.retrieve(workspaceSlug, projectId, milestone.id);

    expect(retrievedMilestone).toBeDefined();
    expect(retrievedMilestone.id).toBe(milestone.id);
    expect(retrievedMilestone.title).toBe(milestone.title);
  });

  it("should update a milestone", async () => {
    const updateData: UpdateMilestoneRequest = {
      title: "Updated Test Milestone",
      target_date: "2026-12-31",
    };

    const updatedMilestone = await client.milestones.update(
      workspaceSlug,
      projectId,
      milestone.id,
      updateData
    );

    expect(updatedMilestone).toBeDefined();
    expect(updatedMilestone.id).toBe(milestone.id);
    expect(updatedMilestone.title).toBe("Updated Test Milestone");
    expect(updatedMilestone.target_date).toBe("2026-12-31");
  });

  it("should list milestones", async () => {
    const milestones = await client.milestones.list(workspaceSlug, projectId);

    expect(milestones).toBeDefined();
    expect(Array.isArray(milestones.results)).toBe(true);
    expect(milestones.results.length).toBeGreaterThan(0);

    const foundMilestone = milestones.results.find((m) => m.id === milestone.id);
    expect(foundMilestone).toBeDefined();
    expect(foundMilestone?.title).toBe("Updated Test Milestone");
  });

  it("should add work items to milestone", async () => {
    await client.milestones.addWorkItems(workspaceSlug, projectId, milestone.id, [workItemId]);

    const workItems = await client.milestones.listWorkItems(workspaceSlug, projectId, milestone.id);

    expect(workItems).toBeDefined();
    expect(Array.isArray(workItems.results)).toBe(true);
    expect(workItems.results.length).toBeGreaterThan(0);
  });

  it("should list work items in milestone", async () => {
    const workItems = await client.milestones.listWorkItems(workspaceSlug, projectId, milestone.id);

    expect(workItems).toBeDefined();
    expect(Array.isArray(workItems.results)).toBe(true);
    expect(workItems.results.length).toBeGreaterThan(0);
  });

  it("should remove work items from milestone", async () => {
    await client.milestones.removeWorkItems(workspaceSlug, projectId, milestone.id, [workItemId]);

    const workItems = await client.milestones.listWorkItems(workspaceSlug, projectId, milestone.id);

    expect(workItems).toBeDefined();
    expect(Array.isArray(workItems.results)).toBe(true);

    const foundWorkItem = workItems.results.find((item: MilestoneWorkItem) => item.issue === workItemId);
    expect(foundWorkItem).toBeUndefined();
  });

  it("should delete a milestone", async () => {
    await client.milestones.delete(workspaceSlug, projectId, milestone.id);

    // Verify it's deleted by trying to retrieve it
    try {
      await client.milestones.retrieve(workspaceSlug, projectId, milestone.id);
      fail("Expected an error when retrieving a deleted milestone");
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Prevent afterAll from trying to delete again
    milestone = undefined as any;
  });
});
