import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemType } from "../../../src/models/WorkItemType";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";
import { workspaceManagedReason } from "../../helpers/governance";

describe(!!(config.workspaceSlug && config.projectId), "Work Item Types API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemType: WorkItemType;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;

    // Enable work item types if not already enabled
    await client.projects.update(workspaceSlug, projectId, {
      is_issue_type_enabled: true,
    });
  });

  afterAll(async () => {
    // Clean up created work item type
    if (workItemType?.id) {
      try {
        await client.workItemTypes.delete(workspaceSlug, projectId, workItemType.id);
      } catch (error) {
        console.warn("Failed to delete work item type:", error);
      }
    }
  });

  it("should list work item types (read path, always runs)", async () => {
    const types = await client.workItemTypes.list(workspaceSlug, projectId);
    expect(Array.isArray(types)).toBe(true);
  });

  it("should create a work item type", async () => {
    try {
      workItemType = await client.workItemTypes.create(workspaceSlug, projectId, {
        name: randomizeName("Test WI Type"),
      });
    } catch (error: any) {
      const reason = workspaceManagedReason(error);
      if (reason !== null) {
        console.warn("Skipped: project-level work item types are managed at the workspace level —", reason);
        return;
      }
      const msg = String(error?.response?.error ?? error?.response?.detail ?? "");
      if (error?.statusCode === 400 && msg.includes("work item types")) {
        console.warn("Server blocks project-level work item types (workspace types enabled) — skipping:", msg);
        return;
      }
      throw error;
    }

    expect(workItemType).toBeDefined();
    expect(workItemType.id).toBeDefined();
    expect(workItemType.name).toContain("Test WI Type");
  });

  it("should retrieve a work item type", async () => {
    if (!workItemType?.id) return;
    const retrievedWorkItemType = await client.workItemTypes.retrieve(workspaceSlug, projectId, workItemType.id!);

    expect(retrievedWorkItemType).toBeDefined();
    expect(retrievedWorkItemType.id).toBe(workItemType.id);
    expect(retrievedWorkItemType.name).toBe(workItemType.name);
  });

  it("should update a work item type", async () => {
    if (!workItemType?.id) return;
    const updatedWorkItemType = await client.workItemTypes.update(workspaceSlug, projectId, workItemType.id!, {
      name: randomizeName("Updated Test WI Type"),
    });

    expect(updatedWorkItemType).toBeDefined();
    expect(updatedWorkItemType.id).toBe(workItemType.id);
    expect(updatedWorkItemType.name).toContain("Updated Test WI Type");
  });

  it("should list work item types", async () => {
    if (!workItemType?.id) return;
    const workItemTypes = await client.workItemTypes.list(workspaceSlug, projectId);

    expect(workItemTypes).toBeDefined();
    expect(Array.isArray(workItemTypes)).toBe(true);
    expect(workItemTypes.length).toBeGreaterThan(0);

    const foundType = workItemTypes.find((t) => t.id === workItemType.id);
    expect(foundType).toBeDefined();
  });
});
