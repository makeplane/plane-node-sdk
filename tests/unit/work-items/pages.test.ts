import { PlaneClient } from "../../../src/client/plane-client";
import { Page, WorkItemPage } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Work Item Pages API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;
  let page: Page;
  let workItemPage: WorkItemPage;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;

    page = await client.pages.createProjectPage(workspaceSlug, projectId, {
      name: randomizeName("Work Item Page"),
      description_html: "<p>work item page test</p>",
    });
  });

  afterAll(async () => {
    if (page?.id) {
      try {
        await client.pages.deleteProjectPage(workspaceSlug, projectId, page.id);
      } catch (error) {
        console.warn("Failed to delete page:", error);
      }
    }
  });

  it("should link a page to a work item", async () => {
    workItemPage = await client.workItems.pages.create(workspaceSlug, projectId, workItemId, {
      page_id: page.id,
    });

    expect(workItemPage).toBeDefined();
    expect(workItemPage.id).toBeDefined();
  });

  it("should list page links for a work item", async () => {
    const pages = await client.workItems.pages.list(workspaceSlug, projectId, workItemId);

    expect(pages).toBeDefined();
    expect(Array.isArray(pages.results)).toBe(true);
    expect(pages.results.find((p) => p.id === workItemPage.id)).toBeDefined();
  });

  it("should retrieve a page link", async () => {
    const retrieved = await client.workItems.pages.retrieve(workspaceSlug, projectId, workItemId, workItemPage.id!);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(workItemPage.id);
    expect(retrieved.page?.id).toBe(page.id);
  });

  it("should remove a page link from a work item", async () => {
    await expect(
      client.workItems.pages.delete(workspaceSlug, projectId, workItemId, workItemPage.id!)
    ).resolves.toBeUndefined();

    const pages = await client.workItems.pages.list(workspaceSlug, projectId, workItemId);
    expect(pages.results.find((p) => p.id === workItemPage.id)).toBeUndefined();
  });
});
