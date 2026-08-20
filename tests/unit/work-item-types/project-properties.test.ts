import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemProperty, WorkItemType } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";
import { workspaceManagedReason } from "../../helpers/governance";

describe(!!(config.workspaceSlug && config.projectId), "Project-Level Work Item Properties API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let property: WorkItemProperty;
  let workItemType: WorkItemType;
  // Servers with workspace-level work item types enabled reject project-level
  // types/properties with a 400 — skip gracefully in that configuration.
  let serverBlocksProjectLevel = false;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;

    try {
      workItemType = await client.workItemTypes.create(workspaceSlug, projectId, {
        name: randomizeName("Prop Test Type "),
      });
    } catch (error: any) {
      const reason = workspaceManagedReason(error);
      if (reason !== null) {
        serverBlocksProjectLevel = true;
        console.warn("Skipped: project-level types/properties are managed at the workspace level —", reason);
        return;
      }
      const msg = String(error?.response?.error ?? error?.response?.detail ?? "");
      if (error?.statusCode === 400 && (msg.includes("work item types") || msg.includes("issue properties"))) {
        serverBlocksProjectLevel = true;
        console.warn("Server blocks project-level types/properties by policy — skipping:", msg);
        return;
      }
      throw error;
    }
  });

  afterAll(async () => {
    if (property?.id) {
      try {
        await client.workItemProperties.deleteProject(workspaceSlug, projectId, property.id);
      } catch (error) {
        console.warn("Failed to delete project property:", error);
      }
    }
    if (workItemType?.id) {
      try {
        await client.workItemTypes.delete(workspaceSlug, projectId, workItemType.id);
      } catch (error) {
        console.warn("Failed to delete work item type:", error);
      }
    }
  });

  it("should list project-level properties (read path, always runs)", async () => {
    const props = await client.workItemProperties.listProject(workspaceSlug, projectId);
    expect(Array.isArray(props)).toBe(true);
  });

  it("should create a project-level property", async () => {
    if (serverBlocksProjectLevel) return;
    const propertyName = randomizeName("project_prop_");
    property = await client.workItemProperties.createProject(workspaceSlug, projectId, {
      name: propertyName,
      display_name: propertyName,
      property_type: "TEXT",
      is_required: false,
    });

    expect(property).toBeDefined();
    expect(property.id).toBeDefined();
  });

  it("should list project-level properties", async () => {
    if (serverBlocksProjectLevel) return;
    const properties = await client.workItemProperties.listProject(workspaceSlug, projectId);

    expect(Array.isArray(properties)).toBe(true);
    expect(properties.find((p) => p.id === property.id)).toBeDefined();
  });

  it("should retrieve a project-level property", async () => {
    if (serverBlocksProjectLevel) return;
    const retrieved = await client.workItemProperties.retrieveProject(workspaceSlug, projectId, property.id!);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(property.id);
  });

  it("should update a project-level property", async () => {
    if (serverBlocksProjectLevel) return;
    const updated = await client.workItemProperties.updateProject(workspaceSlug, projectId, property.id!, {
      description: "Updated property description",
    });

    expect(updated).toBeDefined();
    expect(updated.id).toBe(property.id);
  });

  it("should attach a property to a work item type", async () => {
    if (serverBlocksProjectLevel) return;
    const attached = await client.workItemProperties.attachToType(workspaceSlug, projectId, workItemType.id!, [
      property.id!,
    ]);

    expect(Array.isArray(attached)).toBe(true);
  });

  it("should detach a property from a work item type", async () => {
    if (serverBlocksProjectLevel) return;
    await expect(
      client.workItemProperties.detachFromType(workspaceSlug, projectId, workItemType.id!, property.id!)
    ).resolves.toBeUndefined();
  });

  it("should delete a project-level property", async () => {
    if (serverBlocksProjectLevel) return;
    await expect(
      client.workItemProperties.deleteProject(workspaceSlug, projectId, property.id!)
    ).resolves.toBeUndefined();
    property = undefined as unknown as WorkItemProperty;
  });
});
