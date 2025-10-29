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
});
