import { PlaneClient } from "../../src/client/plane-client";
import { UpdateCycleRequest, Cycle, WorkItem } from "../../src/models";
import { config } from "./constants";
import { createTestClient } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Cycle API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;
  let userId: string;
  let cycle: Cycle;
  let cycle2: Cycle;
  let workItem2: WorkItem;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;

    // Get current user for cycle ownership
    const me = await client.users.me();
    userId = me.id!;

    // Ensure project has cycle view enabled
    const project = await client.projects.retrieve(workspaceSlug, projectId);
    if (!project.cycle_view) {
      await client.projects.update(workspaceSlug, projectId, {
        cycle_view: true,
      });
    }
  });

  afterAll(async () => {
    // Clean up created resources
    if (cycle?.id) {
      try {
        await client.cycles.delete(workspaceSlug, projectId, cycle.id);
      } catch (error) {
        console.warn("Failed to delete cycle:", error);
      }
    }
    if (cycle2?.id) {
      try {
        await client.cycles.delete(workspaceSlug, projectId, cycle2.id);
      } catch (error) {
        console.warn("Failed to delete cycle2:", error);
      }
    }
    if (workItem2?.id) {
      try {
        await client.workItems.delete(workspaceSlug, projectId, workItem2.id);
      } catch (error) {
        console.warn("Failed to delete workItem2:", error);
      }
    }
  });

  it("should create a cycle", async () => {
    cycle = await client.cycles.create(workspaceSlug, projectId, {
      name: "Test Cycle",
      description: "Test Cycle Description",
      owned_by: userId,
      project_id: projectId,
    });

    expect(cycle).toBeDefined();
    expect(cycle.id).toBeDefined();
    expect(cycle.name).toBe("Test Cycle");
    expect(cycle.description).toBe("Test Cycle Description");
    expect(cycle.owned_by).toBe(userId);
    expect(cycle.project).toBe(projectId);
  });

  it("should retrieve a cycle", async () => {
    const retrievedCycle = await client.cycles.retrieve(workspaceSlug, projectId, cycle.id);

    expect(retrievedCycle).toBeDefined();
    expect(retrievedCycle.id).toBe(cycle.id);
    expect(retrievedCycle.name).toBe(cycle.name);
    expect(retrievedCycle.description).toBe(cycle.description);
  });

  it("should update a cycle", async () => {
    const updateData: UpdateCycleRequest = {
      name: "Updated Test Cycle",
      description: "Updated Test Cycle Description",
    };

    const updatedCycle = await client.cycles.update(workspaceSlug, projectId, cycle.id, updateData);

    expect(updatedCycle).toBeDefined();
    expect(updatedCycle.id).toBe(cycle.id);
    expect(updatedCycle.name).toBe("Updated Test Cycle");
    expect(updatedCycle.description).toBe("Updated Test Cycle Description");
  });

  it("should list cycles", async () => {
    const cycles = await client.cycles.list(workspaceSlug, projectId);

    expect(cycles).toBeDefined();
    expect(Array.isArray(cycles.results)).toBe(true);
    expect(cycles.results.length).toBeGreaterThan(0);

    const foundCycle = cycles.results.find((c) => c.id === cycle.id);
    expect(foundCycle).toBeDefined();
    expect(foundCycle?.name).toBe("Updated Test Cycle");
  });

  it("should add work items to cycle", async () => {
    await client.cycles.addWorkItemsToCycle(workspaceSlug, projectId, cycle.id, [workItemId]);

    const itemsInCycle = await client.cycles.listWorkItemsInCycle(workspaceSlug, projectId, cycle.id);

    expect(itemsInCycle).toBeDefined();
    expect(Array.isArray(itemsInCycle.results)).toBe(true);
    expect(itemsInCycle.results.length).toBeGreaterThan(0);

    const foundWorkItem = itemsInCycle.results.find((item) => item.id === workItemId);
    expect(foundWorkItem).toBeDefined();
  });

  it("should remove work item from cycle", async () => {
    await client.cycles.removeWorkItemFromCycle(workspaceSlug, projectId, cycle.id, workItemId);

    const itemsInCycle = await client.cycles.listWorkItemsInCycle(workspaceSlug, projectId, cycle.id);

    expect(itemsInCycle).toBeDefined();
    expect(Array.isArray(itemsInCycle.results)).toBe(true);

    const foundWorkItem = itemsInCycle.results.find((item) => item.id === workItemId);
    expect(foundWorkItem).toBeUndefined();
  });

  it("should create a second cycle for transfer testing", async () => {
    cycle2 = await client.cycles.create(workspaceSlug, projectId, {
      name: "Test Cycle 2",
      description: "Test Cycle 2 Description",
      owned_by: userId,
      project_id: projectId,
    });

    expect(cycle2).toBeDefined();
    expect(cycle2.id).toBeDefined();
    expect(cycle2.name).toBe("Test Cycle 2");
    expect(cycle2.id).not.toBe(cycle.id);
  });

  it("should create a new work item for transfer testing", async () => {
    workItem2 = await client.workItems.create(workspaceSlug, projectId, {
      name: "Test Work Item 2",
    });

    expect(workItem2).toBeDefined();
    expect(workItem2.id).toBeDefined();
    expect(workItem2.name).toBe("Test Work Item 2");
  });

  it("should transfer work items to another cycle", async () => {
    // Add work item back to first cycle for transfer test
    await client.cycles.addWorkItemsToCycle(workspaceSlug, projectId, cycle.id, [workItemId]);

    // Transfer work items from first cycle to second cycle
    await client.cycles.transferWorkItemsToAnotherCycle(workspaceSlug, projectId, cycle.id, {
      new_cycle_id: cycle2.id,
    });

    // Verify work item is now in second cycle
    const itemsInCycle2 = await client.cycles.listWorkItemsInCycle(workspaceSlug, projectId, cycle2.id);
    expect(itemsInCycle2.results.length).toBeGreaterThan(0);

    const foundWorkItem = itemsInCycle2.results.find((item) => item.id === workItemId);
    expect(foundWorkItem).toBeDefined();

    // Verify work item is no longer in first cycle
    const itemsInCycle1 = await client.cycles.listWorkItemsInCycle(workspaceSlug, projectId, cycle.id);
    const foundWorkItemInCycle1 = itemsInCycle1.results.find((item) => item.id === workItemId);
    expect(foundWorkItemInCycle1).toBeUndefined();
  });
});
