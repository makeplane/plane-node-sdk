import { PlaneClient } from "../../../src/client/plane-client";
import { Release, ReleaseComment, ReleaseLabel, ReleaseLink, ReleaseTag } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!config.workspaceSlug, "Releases API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let release: Release;
  let tag: ReleaseTag;
  let label: ReleaseLabel;
  let comment: ReleaseComment;
  let link: ReleaseLink;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    // Clean up created resources
    if (label?.id) {
      try {
        await client.releases.labels.delete(workspaceSlug, label.id);
      } catch (error) {
        console.warn("Failed to delete release label:", error);
      }
    }
    if (tag?.id) {
      try {
        await client.releases.tags.delete(workspaceSlug, tag.id);
      } catch (error) {
        console.warn("Failed to delete release tag:", error);
      }
    }
    if (release?.id) {
      try {
        await client.releases.delete(workspaceSlug, release.id);
      } catch (error) {
        console.warn("Failed to delete release:", error);
      }
    }
  });

  // ─── Releases ─────────────────────────────────────────────────────────────

  it("should create a release", async () => {
    release = await client.releases.create(workspaceSlug, {
      name: randomizeName("Test Release"),
    });
    expect(release).toBeDefined();
    expect(release.id).toBeDefined();
    expect(release.name).toContain("Test Release");
    expect(release.workspace).toBeDefined();
  });

  it("should list releases", async () => {
    const releases = await client.releases.list(workspaceSlug);
    expect(Array.isArray(releases)).toBe(true);
    expect(releases.find((r) => r.id === release.id)).toBeDefined();
  });

  it("should retrieve a release", async () => {
    const retrieved = await client.releases.retrieve(workspaceSlug, release.id!);
    expect(retrieved.id).toBe(release.id);
    expect(retrieved.name).toBe(release.name);
  });

  it("should update a release", async () => {
    const updated = await client.releases.update(workspaceSlug, release.id!, {
      name: randomizeName("Updated Release"),
    });
    expect(updated.id).toBe(release.id);
    expect(updated.name).toContain("Updated Release");
    release = updated;
  });

  // ─── Release Tags ─────────────────────────────────────────────────────────

  it("should create a release tag", async () => {
    tag = await client.releases.tags.create(workspaceSlug, {
      version: randomizeName("v1.0.0-"),
      description: "Test tag description",
    });
    expect(tag).toBeDefined();
    expect(tag.id).toBeDefined();
    expect(tag.version).toContain("v1.0.0-");
  });

  it("should list release tags", async () => {
    const tags = await client.releases.tags.list(workspaceSlug);
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.find((t) => t.id === tag.id)).toBeDefined();
  });

  it("should retrieve a release tag", async () => {
    const retrieved = await client.releases.tags.retrieve(workspaceSlug, tag.id!);
    expect(retrieved.id).toBe(tag.id);
    expect(retrieved.version).toBe(tag.version);
  });

  it("should update a release tag", async () => {
    const updated = await client.releases.tags.update(workspaceSlug, tag.id!, {
      description: "Updated tag description",
    });
    expect(updated.id).toBe(tag.id);
    expect(updated.description).toBe("Updated tag description");
  });

  // ─── Release Labels ───────────────────────────────────────────────────────

  it("should create a release label", async () => {
    label = await client.releases.labels.create(workspaceSlug, {
      name: randomizeName("Test Label"),
      color: "#33AAFF",
    });
    expect(label).toBeDefined();
    expect(label.id).toBeDefined();
    expect(label.name).toContain("Test Label");
  });

  it("should list release labels", async () => {
    // The list endpoint is paginated (20 per page), so the newly created label
    // may not be on the first page — retrieve() covers direct lookup.
    const labels = await client.releases.labels.list(workspaceSlug);
    expect(Array.isArray(labels)).toBe(true);
    expect(labels.length).toBeGreaterThan(0);
  });

  it("should retrieve a release label", async () => {
    const retrieved = await client.releases.labels.retrieve(workspaceSlug, label.id!);
    expect(retrieved.id).toBe(label.id);
    expect(retrieved.name).toBe(label.name);
  });

  it("should update a release label", async () => {
    const updated = await client.releases.labels.update(workspaceSlug, label.id!, {
      color: "#00FF00",
    });
    expect(updated.id).toBe(label.id);
  });

  // ─── Release Item Labels ──────────────────────────────────────────────────

  it("should add a label to a release", async () => {
    const added = await client.releases.itemLabels.create(workspaceSlug, release.id!, {
      label_ids: [label.id!],
    });
    expect(Array.isArray(added)).toBe(true);
  });

  it("should list labels on a release", async () => {
    const itemLabels = await client.releases.itemLabels.list(workspaceSlug, release.id!);
    expect(Array.isArray(itemLabels)).toBe(true);
    expect(itemLabels.find((l) => l.id === label.id)).toBeDefined();
  });

  it("should remove a label from a release", async () => {
    await expect(client.releases.itemLabels.delete(workspaceSlug, release.id!, [label.id!])).resolves.toBeUndefined();
    const itemLabels = await client.releases.itemLabels.list(workspaceSlug, release.id!);
    expect(itemLabels.find((l) => l.id === label.id)).toBeUndefined();
  });

  // ─── Release Changelog ────────────────────────────────────────────────────

  it("should update and retrieve the release changelog", async () => {
    await client.releases.changelog.update(workspaceSlug, release.id!, {
      description_html: "<p>Changelog entry</p>",
    });
    const changelog = await client.releases.changelog.retrieve(workspaceSlug, release.id!);
    expect(changelog).toBeDefined();
  });

  // ─── Release Comments ─────────────────────────────────────────────────────

  it("should create a release comment", async () => {
    comment = await client.releases.comments.create(workspaceSlug, release.id!, {
      comment_html: "<p>Test comment</p>",
    });
    expect(comment).toBeDefined();
    expect(comment.id).toBeDefined();
  });

  it("should list release comments", async () => {
    const comments = await client.releases.comments.list(workspaceSlug, release.id!);
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.find((c) => c.id === comment.id)).toBeDefined();
  });

  it("should retrieve a release comment", async () => {
    const retrieved = await client.releases.comments.retrieve(workspaceSlug, release.id!, comment.id!);
    expect(retrieved.id).toBe(comment.id);
  });

  it("should update a release comment", async () => {
    const updated = await client.releases.comments.update(workspaceSlug, release.id!, comment.id!, {
      comment_html: "<p>Updated comment</p>",
    });
    expect(updated.id).toBe(comment.id);
  });

  it("should delete a release comment", async () => {
    await expect(client.releases.comments.delete(workspaceSlug, release.id!, comment.id!)).resolves.toBeUndefined();
  });

  // ─── Release Links ────────────────────────────────────────────────────────

  it("should create a release link", async () => {
    link = await client.releases.links.create(workspaceSlug, release.id!, {
      url: "https://example.com/changelog",
      title: "Changelog",
    });
    expect(link).toBeDefined();
    expect(link.id).toBeDefined();
    expect(link.url).toBe("https://example.com/changelog");
  });

  it("should list release links", async () => {
    const links = await client.releases.links.list(workspaceSlug, release.id!);
    expect(Array.isArray(links)).toBe(true);
    expect(links.find((l) => l.id === link.id)).toBeDefined();
  });

  it("should retrieve a release link", async () => {
    const retrieved = await client.releases.links.retrieve(workspaceSlug, release.id!, link.id!);
    expect(retrieved.id).toBe(link.id);
  });

  it("should update a release link", async () => {
    const updated = await client.releases.links.update(workspaceSlug, release.id!, link.id!, {
      title: "Updated Changelog",
    });
    expect(updated.id).toBe(link.id);
    expect(updated.title).toBe("Updated Changelog");
  });

  it("should delete a release link", async () => {
    await expect(client.releases.links.delete(workspaceSlug, release.id!, link.id!)).resolves.toBeUndefined();
  });

  // ─── Release Work Items ───────────────────────────────────────────────────

  it("should attach, list, and detach release work items", async () => {
    if (!config.workItemId) {
      return;
    }
    await client.releases.workItems.create(workspaceSlug, release.id!, [config.workItemId]);

    const workItems = await client.releases.workItems.list(workspaceSlug, release.id!);
    expect(Array.isArray(workItems)).toBe(true);
    expect(workItems.find((w) => w.id === config.workItemId)).toBeDefined();

    await client.releases.workItems.delete(workspaceSlug, release.id!, [config.workItemId]);
    const afterRemoval = await client.releases.workItems.list(workspaceSlug, release.id!);
    expect(afterRemoval.find((w) => w.id === config.workItemId)).toBeUndefined();
  });

  // ─── Release Delete ───────────────────────────────────────────────────────

  it("should delete a release", async () => {
    await expect(client.releases.delete(workspaceSlug, release.id!)).resolves.toBeUndefined();
    release = undefined as unknown as Release;
  });
});
