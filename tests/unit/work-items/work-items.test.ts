import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItem } from "../../../src/models/WorkItem";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.userId), "Work Items API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let userId: string;
  let workItem: WorkItem;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    userId = config.userId;
  });

  afterAll(async () => {
    // Clean up created work item
    if (workItem?.id) {
      try {
        await client.workItems.delete(workspaceSlug, projectId, workItem.id);
      } catch (error) {
        console.warn("Failed to delete work item:", error);
      }
    }
  });

  it("should create a work item", async () => {
    const name = randomizeName();
    workItem = await client.workItems.create(workspaceSlug, projectId, {
      name,
      description_html: "<p>A work item created via the Plane SDK</p>",
    });

    expect(workItem).toBeDefined();
    expect(workItem.id).toBeDefined();
    expect(workItem.name).toContain(name);
    expect(workItem.description_html).toBe("<p>A work item created via the Plane SDK</p>");
  });

  it("should retrieve a work item", async () => {
    const retrievedWorkItem = await client.workItems.retrieve(workspaceSlug, projectId, workItem.id!);

    expect(retrievedWorkItem).toBeDefined();
    expect(retrievedWorkItem.id).toBe(workItem.id);
    expect(retrievedWorkItem.name).toBe(workItem.name);
  });

  it("should update a work item", async () => {
    const states = await client.states.list(workspaceSlug, projectId);
    const labels = await client.labels.list(workspaceSlug, projectId);

    const label = labels.results[0];
    const state = states.results[0];

    const updatedWorkItem = await client.workItems.update(workspaceSlug, projectId, workItem.id!, {
      name: `${workItem.name} - Updated`,
      description_html: "<p>Updated Test Work Item Description</p>",
      state: state ? state.id : undefined,
      assignees: [userId],
      labels: label ? [label.id] : undefined,
    });

    expect(updatedWorkItem).toBeDefined();
    expect(updatedWorkItem.id).toBe(workItem.id);
    expect(updatedWorkItem.name).toBe(`${workItem.name} - Updated`);
    expect(updatedWorkItem.description_html).toBe("<p>Updated Test Work Item Description</p>");
  });

  it("should list work items", async () => {
    const workItems = await client.workItems.list(workspaceSlug, projectId);

    expect(workItems).toBeDefined();
    expect(Array.isArray(workItems.results)).toBe(true);
    expect(workItems.results.length).toBeGreaterThan(0);

    const foundWorkItem = workItems.results.find((wi) => wi.id === workItem.id);
    expect(foundWorkItem).toBeDefined();
  });

  it("should retrieve work item by identifier", async () => {
    const project = await client.projects.retrieve(workspaceSlug, projectId);
    const workItemByIdentifier = await client.workItems.retrieveByIdentifier(
      workspaceSlug,
      `${project.identifier}-${workItem.sequence_id}`,
      ["project"]
    );

    expect(workItemByIdentifier).toBeDefined();
    expect(workItemByIdentifier.id).toBe(workItem.id);
  });

  it("should search work items", async () => {
    const searchedWorkItemsResponse = await client.workItems.search(workspaceSlug, workItem.name);

    expect(searchedWorkItemsResponse.issues).toBeDefined();
    expect(Array.isArray(searchedWorkItemsResponse.issues)).toBe(true);
    expect(searchedWorkItemsResponse.issues.length).toBeGreaterThan(0);
    const foundWorkItem = searchedWorkItemsResponse.issues.find((wi) => wi.id === workItem.id);
    expect(foundWorkItem).toBeDefined();
  });
});
