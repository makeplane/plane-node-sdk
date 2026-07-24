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
  // Epics can't be enabled on a project when workspace-level work item types
  // are enabled (server returns 400) — in that config the write endpoints are
  // unavailable, so we skip them rather than fail.
  let epicsUnavailable = false;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;

    try {
      await client.projects.updateFeatures(workspaceSlug, projectId, { epics: true });
    } catch (error: any) {
      const msg = String(error?.response?.epics ?? error?.response?.error ?? error?.response?.detail ?? "");
      if (error?.statusCode === 400 && msg.toLowerCase().includes("epic")) {
        epicsUnavailable = true;
        console.warn("Epics cannot be enabled on this project (workspace-level types enabled) — skipping writes:", msg);
        return;
      }
      throw error;
    }
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

  it("should list epics (read path, always runs)", async () => {
    const epics = await client.epics.list(workspaceSlug, projectId);
    expect(epics).toBeDefined();
    expect(Array.isArray(epics.results)).toBe(true);
  });

  it("should create an epic", async () => {
    if (epicsUnavailable) return;
    const name = randomizeName("epic-");
    epic = await client.epics.create(workspaceSlug, projectId, { name, priority: "high" });

    expect(epic).toBeDefined();
    expect(epic.id).toBeDefined();
    expect(epic.name).toBe(name);
  });

  it("should retrieve an epic", async () => {
    if (epicsUnavailable) return;
    const retrieved = await client.epics.retrieve(workspaceSlug, projectId, epic.id!);
    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(epic.id);
    expect(retrieved.name).toBe(epic.name);
  });

  it("should update an epic", async () => {
    if (epicsUnavailable) return;
    const updateData: UpdateEpic = { name: "Updated Epic Name" };
    const updated = await client.epics.update(workspaceSlug, projectId, epic.id!, updateData);

    expect(updated).toBeDefined();
    expect(updated.id).toBe(epic.id);
    expect(updated.name).toBe("Updated Epic Name");
    epic = updated;
  });

  it("should list epics (find created)", async () => {
    if (epicsUnavailable) return;
    const epics = await client.epics.list(workspaceSlug, projectId);
    expect(epics.results.length).toBeGreaterThan(0);
    expect(epics.results.find((e) => e.id === epic.id)).toBeDefined();
  });

  it("should list epic issues", async () => {
    if (epicsUnavailable) return;
    const issues = await client.epics.listIssues(workspaceSlug, projectId, epic.id!);
    expect(issues).toBeDefined();
    expect(Array.isArray(issues.results)).toBe(true);
  });

  it("should add work items to epic", async () => {
    if (epicsUnavailable) return;
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
