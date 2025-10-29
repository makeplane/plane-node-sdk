import { PlaneClient } from "../../../src/client/plane-client";
import { Link } from "../../../src/models/Link";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Work Item Links API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;
  let link: Link;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;
  });

  afterAll(async () => {
    // Clean up created link
    if (link?.id) {
      try {
        await client.workItems.links.delete(workspaceSlug, projectId, workItemId, link.id);
      } catch (error) {
        console.warn("Failed to delete link:", error);
      }
    }
  });

  it("should create a link", async () => {
    link = await client.workItems.links.create(workspaceSlug, projectId, workItemId, {
      title: randomizeName("Test Link"),
      url: "https://test.com",
    });

    expect(link).toBeDefined();
    expect(link.id).toBeDefined();
    expect(link.title).toContain("Test Link");
    expect(link.url).toBe("https://test.com");
  });

  it("should retrieve a link", async () => {
    const retrievedLink = await client.workItems.links.retrieve(workspaceSlug, projectId, workItemId, link.id!);

    expect(retrievedLink).toBeDefined();
    expect(retrievedLink.id).toBe(link.id);
    expect(retrievedLink.title).toBe(link.title);
  });

  it("should update a link", async () => {
    const updatedLink = await client.workItems.links.update(workspaceSlug, projectId, workItemId, link.id!, {
      title: randomizeName("Updated Test Link"),
      url: "https://updated.com",
    });

    expect(updatedLink).toBeDefined();
    expect(updatedLink.id).toBe(link.id);
    expect(updatedLink.title).toContain("Updated Test Link");
    expect(updatedLink.url).toBe("https://updated.com");
  });

  it("should list links", async () => {
    const linksResponse = await client.workItems.links.list(workspaceSlug, projectId, workItemId);

    expect(linksResponse).toBeDefined();
    expect(linksResponse.results).toBeDefined();
    expect(Array.isArray(linksResponse.results)).toBe(true);
    expect(linksResponse.results.length).toBeGreaterThan(0);

    const foundLink = linksResponse.results.find((l) => l.id === link.id);
    expect(foundLink).toBeDefined();
  });
});
