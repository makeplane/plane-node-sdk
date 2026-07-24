import { PlaneClient } from "../../src/client/plane-client";
import { WorkItemType } from "../../src/models";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!config.workspaceSlug, "WorkspaceWorkItemTypes API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let workItemType: WorkItemType;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    // Note: workspace work item types may not support delete via API — skip if needed
  });

  it("should list workspace work item types", async () => {
    const types = await client.workspaceWorkItemTypes.list(workspaceSlug);
    expect(types).toBeDefined();
    expect(Array.isArray(types)).toBe(true);
  });

  it("should create a workspace work item type", async () => {
    workItemType = await client.workspaceWorkItemTypes.create(workspaceSlug, {
      name: randomizeName("WS WI Type"),
    });
    expect(workItemType).toBeDefined();
    expect(workItemType.id).toBeDefined();
    expect(workItemType.name).toContain("WS WI Type");
  });

  it("should retrieve a workspace work item type", async () => {
    const retrieved = await client.workspaceWorkItemTypes.retrieve(workspaceSlug, workItemType.id!);
    expect(retrieved.id).toBe(workItemType.id);
    expect(retrieved.name).toBe(workItemType.name);
  });

  it("should update a workspace work item type", async () => {
    const updated = await client.workspaceWorkItemTypes.update(workspaceSlug, workItemType.id!, {
      name: randomizeName("Updated WS WI Type"),
    });
    expect(updated.id).toBe(workItemType.id);
    expect(updated.name).toContain("Updated WS WI Type");
    workItemType = updated;
  });

  it("should list properties for a workspace work item type", async () => {
    const properties = await client.workspaceWorkItemTypes.properties.list(workspaceSlug, workItemType.id!);
    expect(properties).toBeDefined();
    expect(Array.isArray(properties)).toBe(true);
  });

  it("should support workspace property retrieve and option retrieve/delete", async () => {
    const propertyName = randomizeName("ws_option_prop_");
    const property = await client.workspaceWorkItemProperties.create(workspaceSlug, {
      name: propertyName,
      display_name: propertyName,
      property_type: "OPTION",
      is_required: false,
    });
    expect(property.id).toBeDefined();

    try {
      const retrievedProperty = await client.workspaceWorkItemProperties.retrieve(workspaceSlug, property.id!);
      expect(retrievedProperty.id).toBe(property.id);

      const option = await client.workspaceWorkItemProperties.options.create(workspaceSlug, property.id!, {
        name: randomizeName("Option "),
      });
      expect(option.id).toBeDefined();

      const retrievedOption = await client.workspaceWorkItemProperties.options.retrieve(
        workspaceSlug,
        property.id!,
        option.id!
      );
      expect(retrievedOption.id).toBe(option.id);

      await expect(
        client.workspaceWorkItemProperties.options.delete(workspaceSlug, property.id!, option.id!)
      ).resolves.toBeUndefined();
    } finally {
      try {
        await client.workspaceWorkItemProperties.del(workspaceSlug, property.id!);
      } catch (error) {
        console.warn("Failed to delete workspace property:", error);
      }
    }
  });

  it("should delete a workspace work item type", async () => {
    await expect(client.workspaceWorkItemTypes.delete(workspaceSlug, workItemType.id!)).resolves.toBeUndefined();
    workItemType = undefined as unknown as WorkItemType;
  });
});
