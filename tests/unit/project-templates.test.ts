import { PlaneClient } from "../../src/client/plane-client";
import { WorkItemTemplate, PageTemplate } from "../../src/models";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "ProjectTemplates API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;

  // Work item template under test
  let workItemTemplate: WorkItemTemplate;

  // Page template under test
  let pageTemplate: PageTemplate;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
  });

  afterAll(async () => {
    if (workItemTemplate?.id) {
      try {
        await client.projectTemplates.workItems.del(workspaceSlug, projectId, workItemTemplate.id);
      } catch (error) {
        console.warn("Failed to delete work item template:", error);
      }
    }

    if (pageTemplate?.id) {
      try {
        await client.projectTemplates.pages.del(workspaceSlug, projectId, pageTemplate.id);
      } catch (error) {
        console.warn("Failed to delete page template:", error);
      }
    }
  });

  // ─── Work Item Templates ─────────────────────────────────────────────────────

  it("should create a work item template", async () => {
    workItemTemplate = await client.projectTemplates.workItems.create(workspaceSlug, projectId, {
      name: randomizeName("Test WI Template"),
      short_description: "Created by test suite",
    });

    expect(workItemTemplate).toBeDefined();
    expect(workItemTemplate.id).toBeDefined();
    expect(workItemTemplate.name).toContain("Test WI Template");
    expect(workItemTemplate.short_description).toBe("Created by test suite");
    expect(workItemTemplate.project).toBe(projectId);
  });

  it("should list work item templates", async () => {
    const templates = await client.projectTemplates.workItems.list(workspaceSlug, projectId);

    expect(templates).toBeDefined();
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);

    const found = templates.find((t) => t.id === workItemTemplate.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe(workItemTemplate.name);
  });

  it("should update a work item template", async () => {
    const updated = await client.projectTemplates.workItems.update(workspaceSlug, projectId, workItemTemplate.id!, {
      name: randomizeName("Updated WI Template"),
    });

    expect(updated).toBeDefined();
    expect(updated.id).toBe(workItemTemplate.id);
    expect(updated.name).toContain("Updated WI Template");

    workItemTemplate = updated;
  });

  it("should delete a work item template", async () => {
    await expect(
      client.projectTemplates.workItems.del(workspaceSlug, projectId, workItemTemplate.id!)
    ).resolves.toBeUndefined();

    // Mark as deleted so afterAll won't attempt again
    workItemTemplate = { ...workItemTemplate, id: undefined } as unknown as WorkItemTemplate;
  });

  // ─── Page Templates ──────────────────────────────────────────────────────────

  it("should create a page template", async () => {
    pageTemplate = await client.projectTemplates.pages.create(workspaceSlug, projectId, {
      name: randomizeName("Test Page Template"),
      short_description: "Created by test suite",
    });

    expect(pageTemplate).toBeDefined();
    expect(pageTemplate.id).toBeDefined();
    expect(pageTemplate.name).toContain("Test Page Template");
    expect(pageTemplate.short_description).toBe("Created by test suite");
    expect(pageTemplate.project).toBe(projectId);
  });

  it("should list page templates", async () => {
    const templates = await client.projectTemplates.pages.list(workspaceSlug, projectId);

    expect(templates).toBeDefined();
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);

    const found = templates.find((t) => t.id === pageTemplate.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe(pageTemplate.name);
  });

  it("should update a page template", async () => {
    const updated = await client.projectTemplates.pages.update(workspaceSlug, projectId, pageTemplate.id!, {
      name: randomizeName("Updated Page Template"),
    });

    expect(updated).toBeDefined();
    expect(updated.id).toBe(pageTemplate.id);
    expect(updated.name).toContain("Updated Page Template");

    pageTemplate = updated;
  });

  it("should delete a page template", async () => {
    await expect(
      client.projectTemplates.pages.del(workspaceSlug, projectId, pageTemplate.id!)
    ).resolves.toBeUndefined();

    // Mark as deleted so afterAll won't attempt again
    pageTemplate = { ...pageTemplate, id: undefined } as unknown as PageTemplate;
  });
});
