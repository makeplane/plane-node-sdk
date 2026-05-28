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
});
