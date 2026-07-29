import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItem } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Work Item Archive & Workspace Listing API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItem: WorkItem;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;

    workItem = await client.workItems.create(workspaceSlug, projectId, {
      name: randomizeName("Archivable Work Item"),
    });

    // Move to a completed state so the work item can be archived
    const states = await client.states.list(workspaceSlug, projectId);
    const completedState = states.results.find((s) => s.group === "completed");
    if (completedState) {
      await client.workItems.update(workspaceSlug, projectId, workItem.id, {
        state: completedState.id,
      });
    }
  });

  afterAll(async () => {
    if (workItem?.id) {
      try {
        await client.workItems.delete(workspaceSlug, projectId, workItem.id);
      } catch (error) {
        console.warn("Failed to delete work item:", error);
      }
    }
  });

  it("should list work items across the workspace", async () => {
    const workItems = await client.workItems.listWorkspace(workspaceSlug);

    expect(workItems).toBeDefined();
    expect(Array.isArray(workItems.results)).toBe(true);
  });

  it("should count work items across the workspace", async () => {
    const count = await client.workItems.countWorkspace(workspaceSlug);

    expect(count).toBeDefined();
    expect(typeof count.total_count).toBe("number");
  });

  it("should count work items grouped by priority", async () => {
    const count = await client.workItems.countWorkspace(workspaceSlug, { group_by: "priority" });

    expect(count).toBeDefined();
    expect(count.grouped_counts).toBeDefined();
  });

  it("should archive a work item", async () => {
    await expect(client.workItems.archive(workspaceSlug, projectId, workItem.id)).resolves.toBeUndefined();
  });

  it("should list archived work items", async () => {
    const archived = await client.workItems.listArchived(workspaceSlug, projectId);

    expect(archived).toBeDefined();
    expect(Array.isArray(archived.results)).toBe(true);
    expect(archived.results.find((w) => w.id === workItem.id)).toBeDefined();
  });

  it("should unarchive a work item", async () => {
    await expect(client.workItems.unarchive(workspaceSlug, projectId, workItem.id)).resolves.toBeUndefined();

    const archived = await client.workItems.listArchived(workspaceSlug, projectId);
    expect(archived.results.find((w) => w.id === workItem.id)).toBeUndefined();
  });
});
