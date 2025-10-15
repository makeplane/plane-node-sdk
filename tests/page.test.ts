import fs from "fs";
import { PlaneClient } from "../src/client/plane-client";
import { config } from "./constants";

export async function testPage() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const page = await createPage(client, config.workspaceSlug);
  console.log("Created page: ", page);

  const retrievedPage = await retrievePage(
    client,
    config.workspaceSlug,
    page.id
  );
  console.log("Retrieved page: ", retrievedPage);

  const projectPage = await createProjectPage(
    client,
    config.workspaceSlug,
    config.projectId
  );
  console.log("Created project page: ", projectPage);

  const retrievedProjectPage = await retrieveProjectPage(
    client,
    config.workspaceSlug,
    config.projectId,
    projectPage.id
  );
  console.log("Retrieved project page: ", retrievedProjectPage);
}

async function createPage(client: PlaneClient, workspaceSlug: string) {
  const content = "<p> Blank Space </p>";
  return client.pages.createWorkspacePage(workspaceSlug, {
    name: "Test Page Crashable 3",
    description_html: content,
  });
}

async function retrievePage(
  client: PlaneClient,
  workspaceSlug: string,
  pageId: string
) {
  return client.pages.retrieveWorkspacePage(workspaceSlug, pageId);
}

async function createProjectPage(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const content = "<p> Blank Space </p>";
  return client.pages.createProjectPage(workspaceSlug, projectId, {
    name: "Test Page Crashable 3",
    description_html: content,
  });
}

async function retrieveProjectPage(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  pageId: string
) {
  return client.pages.retrieveProjectPage(workspaceSlug, projectId, pageId);
}

if (require.main === module) {
  testPage().catch(console.error);
}
