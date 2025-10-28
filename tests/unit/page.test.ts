import fs from "fs";
import { PlaneClient } from "../../src/client/plane-client";
import { config } from "./constants";
import { createTestClient } from "../helpers/test-utils";

export async function testPage() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  if (!workspaceSlug) {
    console.error("workspaceSlug is required");
    return;
  }

  if (!projectId) {
    console.error("projectId is required");
    return;
  }

  const page = await createPage(client, workspaceSlug);
  console.log("Created page: ", page);

  const retrievedPage = await retrievePage(client, workspaceSlug, page.id);
  console.log("Retrieved page: ", retrievedPage);

  const projectPage = await createProjectPage(client, workspaceSlug, projectId);
  console.log("Created project page: ", projectPage);

  const retrievedProjectPage = await retrieveProjectPage(client, workspaceSlug, projectId, projectPage.id);
  console.log("Retrieved project page: ", retrievedProjectPage);
}

async function createPage(client: PlaneClient, workspaceSlug: string) {
  const content = "<p> Blank Space </p>";
  return client.pages.createWorkspacePage(workspaceSlug, {
    name: "Test Page Crashable 3",
    description_html: content,
  });
}

async function retrievePage(client: PlaneClient, workspaceSlug: string, pageId: string) {
  return client.pages.retrieveWorkspacePage(workspaceSlug, pageId);
}

async function createProjectPage(client: PlaneClient, workspaceSlug: string, projectId: string) {
  const content = "<p> Blank Space </p>";
  return client.pages.createProjectPage(workspaceSlug, projectId, {
    name: "Test Page Crashable 3",
    description_html: content,
  });
}

async function retrieveProjectPage(client: PlaneClient, workspaceSlug: string, projectId: string, pageId: string) {
  return client.pages.retrieveProjectPage(workspaceSlug, projectId, pageId);
}

async function testCreatePageFromFile() {
  const client = new PlaneClient({
    apiKey: "plane_api_fae8f19b1e884400831413ef3adfb68b",
    baseUrl: "https://test-leak.feat.plane.town",
    enableLogging: true,
  });

  const file = fs.readFileSync("/Users/prashantsurya/Projects/sdks/plane-node-sdk/CrashablePage.html", "utf8");

  const page = await client.pages.createWorkspacePage("testt", {
    name: "Test Page Crashable 3",
    description_html: file,
  });
  console.log("Created page: ", page);
}

if (require.main === module) {
  testCreatePageFromFile().catch(console.error);
}
