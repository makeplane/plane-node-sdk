import { config } from "./constants";
import { PlaneClient } from "../../src/client/plane-client";
import { Epic, UpdateEpic } from "../../src/models/Epic";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Epic API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let epic: Epic;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    // update the project to enable epics
    await client.projects.updateFeatures(workspaceSlug, projectId, {
      epics: true,
    });
  });

  afterAll(async () => {
    if (epic?.id) {
      try {
        await client.epics.delete(workspaceSlug, projectId, epic.id);
      } catch (error) {
        console.warn("Failed to delete epic:", error);
      }
    }
  });

  it("should create an epic", async () => {
    const name = randomizeName("epic-");
    epic = await client.epics.create(workspaceSlug, projectId, {
      name: name,
      priority: "high",
    });

    expect(epic).toBeDefined();
    expect(epic.id).toBeDefined();
    expect(epic.name).toBe(name);
  });

  it("should retrieve an epic", async () => {
    const retrieved = await client.epics.retrieve(workspaceSlug, projectId, epic.id!);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(epic.id);
    expect(retrieved.name).toBe(epic.name);
  });

  it("should update an epic", async () => {
    const updateData: UpdateEpic = {
      name: "Updated Epic Name",
    };

    const updated = await client.epics.update(workspaceSlug, projectId, epic.id!, updateData);

    expect(updated).toBeDefined();
    expect(updated.id).toBe(epic.id);
    expect(updated.name).toBe("Updated Epic Name");
    epic = updated;
  });

  it("should list epics", async () => {
    const epics = await client.epics.list(workspaceSlug, projectId);

    expect(epics).toBeDefined();
    expect(epics.results.length).toBeGreaterThan(0);

    const found = epics.results.find((e) => e.id === epic.id);
    expect(found).toBeDefined();
  });

  it("should list epic issues", async () => {
    const issues = await client.epics.listIssues(workspaceSlug, projectId, epic.id!);

    expect(issues).toBeDefined();
    expect(Array.isArray(issues.results)).toBe(true);
  });

  it("should add work items to epic", async () => {
    const workItem = await client.workItems.create(workspaceSlug, projectId, {
      name: randomizeName("work-item-"),
    });

    try {
      const addedIssues = await client.epics.addIssues(workspaceSlug, projectId, epic.id!, {
        work_item_ids: [workItem.id],
      });

      expect(addedIssues).toBeDefined();
      expect(Array.isArray(addedIssues)).toBe(true);
      expect(addedIssues.length).toBe(1);
      expect(addedIssues[0]!.parent).toBe(epic.id);
    } finally {
      await client.workItems.delete(workspaceSlug, projectId, workItem.id);
    }
  });
});
