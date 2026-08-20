import { PlaneClient } from "../../src/client/plane-client";
import { Page } from "../../src/models/Page";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Page API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workspacePage: Page;
  let projectPage: Page;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
  });

  it("should create a workspace page", async () => {
    const content = "<p>Test Page Content</p>";
    workspacePage = await client.pages.createWorkspacePage(workspaceSlug, {
      name: randomizeName("Test Workspace Page"),
      description_html: content,
    });

    expect(workspacePage).toBeDefined();
    expect(workspacePage.id).toBeDefined();
    expect(workspacePage.name).toContain("Test Workspace Page");
  });

  it("should retrieve a workspace page", async () => {
    const retrievedPage = await client.pages.retrieveWorkspacePage(workspaceSlug, workspacePage.id!);

    expect(retrievedPage).toBeDefined();
    expect(retrievedPage.id).toBe(workspacePage.id);
    expect(retrievedPage.name).toBe(workspacePage.name);
  });

  it("should create a project page", async () => {
    const content = "<p>Test Project Page Content</p>";
    projectPage = await client.pages.createProjectPage(workspaceSlug, projectId, {
      name: randomizeName("Test Project Page"),
      description_html: content,
    });

    expect(projectPage).toBeDefined();
    expect(projectPage.id).toBeDefined();
    expect(projectPage.name).toContain("Test Project Page");
  });

  it("should retrieve a project page", async () => {
    const retrievedProjectPage = await client.pages.retrieveProjectPage(workspaceSlug, projectId, projectPage.id!);

    expect(retrievedProjectPage).toBeDefined();
    expect(retrievedProjectPage.id).toBe(projectPage.id);
    expect(retrievedProjectPage.name).toBe(projectPage.name);
  });

  it("should list workspace pages", async () => {
    const pages = await client.pages.listWorkspacePages(workspaceSlug);

    expect(pages).toBeDefined();
    expect(Array.isArray(pages.results)).toBe(true);
    expect(pages.results.find((p) => p.id === workspacePage.id)).toBeDefined();
  });

  it("should list project pages", async () => {
    const pages = await client.pages.listProjectPages(workspaceSlug, projectId);

    expect(pages).toBeDefined();
    expect(Array.isArray(pages.results)).toBe(true);
    expect(pages.results.find((p) => p.id === projectPage.id)).toBeDefined();
  });

  it("should update a workspace page", async () => {
    const name = randomizeName("Updated Workspace Page");
    const updated = await client.pages.updateWorkspacePage(workspaceSlug, workspacePage.id!, { name });

    expect(updated.id).toBe(workspacePage.id);
    expect(updated.name).toBe(name);
  });

  it("should update a project page's name and content", async () => {
    const name = randomizeName("Updated Project Page");
    const updated = await client.pages.updateProjectPage(workspaceSlug, projectId, projectPage.id!, {
      name,
      description_html: "<p>Revised Content</p>",
    });

    expect(updated.id).toBe(projectPage.id);
    expect(updated.name).toBe(name);
  });

  it("should refuse an update that carries no field to change", async () => {
    // Refused rather than reported as a successful no-op.
    await expect(client.pages.updateProjectPage(workspaceSlug, projectId, projectPage.id!, {})).rejects.toThrow();
  });

  it("should archive and unarchive a workspace page", async () => {
    await client.pages.archiveWorkspacePage(workspaceSlug, workspacePage.id!);
    expect((await client.pages.retrieveWorkspacePage(workspaceSlug, workspacePage.id!)).archived_at).toBeTruthy();

    await client.pages.unarchiveWorkspacePage(workspaceSlug, workspacePage.id!);
    expect((await client.pages.retrieveWorkspacePage(workspaceSlug, workspacePage.id!)).archived_at).toBeFalsy();
  });

  it("should refuse to delete a page that is not archived", async () => {
    const page = await client.pages.createProjectPage(workspaceSlug, projectId, {
      name: randomizeName("Test Delete Page"),
      description_html: "<p>Draft</p>",
    });

    await expect(client.pages.deleteProjectPage(workspaceSlug, projectId, page.id!)).rejects.toThrow();

    await client.pages.archiveProjectPage(workspaceSlug, projectId, page.id!);
    await client.pages.deleteProjectPage(workspaceSlug, projectId, page.id!);
  });
});
