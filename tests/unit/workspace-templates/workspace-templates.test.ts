import { PlaneClient } from "../../../src/client/plane-client";
import { WorkspaceWorkItemTemplate, WorkspaceProjectTemplate, WorkspacePageTemplate } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!config.workspaceSlug, "WorkspaceTemplates API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;

  let workItemTemplate: WorkspaceWorkItemTemplate;
  let projectTemplate: WorkspaceProjectTemplate;
  let pageTemplate: WorkspacePageTemplate;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    if (workItemTemplate?.id) {
      try {
        await client.workspaceTemplates.workItems.del(workspaceSlug, workItemTemplate.id);
      } catch (error) {
        console.warn("Failed to delete workspace work item template:", error);
      }
    }
    if (projectTemplate?.id) {
      try {
        await client.workspaceTemplates.projects.del(workspaceSlug, projectTemplate.id);
      } catch (error) {
        console.warn("Failed to delete workspace project template:", error);
      }
    }
    if (pageTemplate?.id) {
      try {
        await client.workspaceTemplates.pages.del(workspaceSlug, pageTemplate.id);
      } catch (error) {
        console.warn("Failed to delete workspace page template:", error);
      }
    }
  });

  // ─── Work Item Templates ─────────────────────────────────────────────────────

  it("should create a workspace work item template", async () => {
    workItemTemplate = await client.workspaceTemplates.workItems.create(workspaceSlug, {
      name: randomizeName("WS WI Template"),
    });
    expect(workItemTemplate).toBeDefined();
    expect(workItemTemplate.id).toBeDefined();
    expect(workItemTemplate.name).toContain("WS WI Template");
    expect(workItemTemplate.workspace).toBeDefined();
  });

  it("should list workspace work item templates", async () => {
    const templates = await client.workspaceTemplates.workItems.list(workspaceSlug);
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);
    expect(templates.find((t) => t.id === workItemTemplate.id)).toBeDefined();
  });

  it("should update a workspace work item template", async () => {
    const updated = await client.workspaceTemplates.workItems.update(workspaceSlug, workItemTemplate.id!, {
      name: randomizeName("Updated WS WI Template"),
    });
    expect(updated.id).toBe(workItemTemplate.id);
    expect(updated.name).toContain("Updated WS WI Template");
    workItemTemplate = updated;
  });

  it("should delete a workspace work item template", async () => {
    await expect(client.workspaceTemplates.workItems.del(workspaceSlug, workItemTemplate.id!)).resolves.toBeUndefined();
    workItemTemplate = { ...workItemTemplate, id: undefined } as unknown as WorkspaceWorkItemTemplate;
  });

  // ─── Project Templates ───────────────────────────────────────────────────────

  it("should create a workspace project template", async () => {
    projectTemplate = await client.workspaceTemplates.projects.create(workspaceSlug, {
      name: randomizeName("WS Project Template"),
    });
    expect(projectTemplate).toBeDefined();
    expect(projectTemplate.id).toBeDefined();
    expect(projectTemplate.name).toContain("WS Project Template");
  });

  it("should list workspace project templates", async () => {
    const templates = await client.workspaceTemplates.projects.list(workspaceSlug);
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.find((t) => t.id === projectTemplate.id)).toBeDefined();
  });

  it("should update a workspace project template", async () => {
    const updated = await client.workspaceTemplates.projects.update(workspaceSlug, projectTemplate.id!, {
      name: randomizeName("Updated WS Project Template"),
    });
    expect(updated.id).toBe(projectTemplate.id);
    expect(updated.name).toContain("Updated WS Project Template");
    projectTemplate = updated;
  });

  it("should delete a workspace project template", async () => {
    await expect(client.workspaceTemplates.projects.del(workspaceSlug, projectTemplate.id!)).resolves.toBeUndefined();
    projectTemplate = { ...projectTemplate, id: undefined } as unknown as WorkspaceProjectTemplate;
  });

  // ─── Page Templates ──────────────────────────────────────────────────────────

  it("should create a workspace page template", async () => {
    pageTemplate = await client.workspaceTemplates.pages.create(workspaceSlug, {
      name: randomizeName("WS Page Template"),
    });
    expect(pageTemplate).toBeDefined();
    expect(pageTemplate.id).toBeDefined();
    expect(pageTemplate.name).toContain("WS Page Template");
  });

  it("should list workspace page templates", async () => {
    const templates = await client.workspaceTemplates.pages.list(workspaceSlug);
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.find((t) => t.id === pageTemplate.id)).toBeDefined();
  });

  it("should update a workspace page template", async () => {
    const updated = await client.workspaceTemplates.pages.update(workspaceSlug, pageTemplate.id!, {
      name: randomizeName("Updated WS Page Template"),
    });
    expect(updated.id).toBe(pageTemplate.id);
    expect(updated.name).toContain("Updated WS Page Template");
    pageTemplate = updated;
  });

  it("should delete a workspace page template", async () => {
    await expect(client.workspaceTemplates.pages.del(workspaceSlug, pageTemplate.id!)).resolves.toBeUndefined();
    pageTemplate = { ...pageTemplate, id: undefined } as unknown as WorkspacePageTemplate;
  });
});
