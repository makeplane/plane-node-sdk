import { PlaneClient } from "../../src/client/plane-client";
import { Release, ReleaseStatus, UpdateRelease } from "../../src/models/Release";
import { ReleaseTag } from "../../src/models/ReleaseTag";
import { ReleaseLabel } from "../../src/models/ReleaseLabel";
import { ReleaseComment } from "../../src/models/ReleaseComment";
import { ReleaseLink } from "../../src/models/ReleaseLink";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf } from "../helpers/conditional-tests";

describeIf(!!config.workspaceSlug, "Release API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let release: Release;
  let releaseTag: ReleaseTag;
  let releaseLabel: ReleaseLabel;
  let releaseComment: ReleaseComment;
  let releaseLink: ReleaseLink;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;

    // Create a release tag (version must be unique per workspace)
    releaseTag = await client.releases.tags.create(workspaceSlug, {
      version: `v${randomizeName("")}`,
      description: "Test Release Tag",
    });

    // Create a release label
    releaseLabel = await client.releases.labels.create(workspaceSlug, {
      name: randomizeName("Test Release Label "),
      color: "#FF5733",
      sort_order: 100,
    });
  });

  afterAll(async () => {
    if (release?.id) {
      try {
        await client.releases.delete(workspaceSlug, release.id);
      } catch (error) {
        console.warn("Failed to delete release:", error);
      }
    }
    if (releaseLabel?.id) {
      try {
        await client.releases.labels.delete(workspaceSlug, releaseLabel.id);
      } catch (error) {
        console.warn("Failed to delete release label:", error);
      }
    }
    if (releaseTag?.id) {
      try {
        await client.releases.tags.delete(workspaceSlug, releaseTag.id);
      } catch (error) {
        console.warn("Failed to delete release tag:", error);
      }
    }
  });

  it("should create a release", async () => {
    release = await client.releases.create(workspaceSlug, {
      name: randomizeName("Test Release "),
      description_html: "<p>Test Release Description</p>",
      status: ReleaseStatus.UNRELEASED,
      tag: releaseTag.id,
    });

    expect(release).toBeDefined();
    expect(release.id).toBeDefined();
    expect(release.name).toContain("Test Release");
    expect(release.status).toBe(ReleaseStatus.UNRELEASED);
    expect(release.tag).toBe(releaseTag.id);
  });

  it("should retrieve a release", async () => {
    const retrieved = await client.releases.retrieve(workspaceSlug, release.id);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(release.id);
    expect(retrieved.name).toBe(release.name);
    expect(retrieved.description).toBeDefined();
  });

  it("should update a release", async () => {
    const updateData: UpdateRelease = {
      name: randomizeName("Updated Test Release "),
      status: ReleaseStatus.RELEASED,
    };

    const updated = await client.releases.update(workspaceSlug, release.id, updateData);

    expect(updated).toBeDefined();
    expect(updated.id).toBe(release.id);
    expect(updated.name).toContain("Updated Test Release");
    expect(updated.status).toBe(ReleaseStatus.RELEASED);
  });

  it("should list releases", async () => {
    const releases = await client.releases.list(workspaceSlug);

    expect(releases).toBeDefined();
    expect(Array.isArray(releases.results)).toBe(true);
    expect(releases.results.length).toBeGreaterThan(0);

    const found = releases.results.find((r) => r.id === release.id);
    expect(found).toBeDefined();
  });

  describe("Release Tags", () => {
    it("should create a release tag", () => {
      expect(releaseTag).toBeDefined();
      expect(releaseTag.id).toBeDefined();
      expect(releaseTag.version).toContain("v");
    });

    it("should retrieve a release tag", async () => {
      const retrieved = await client.releases.tags.retrieve(workspaceSlug, releaseTag.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(releaseTag.id);
      expect(retrieved.version).toBe(releaseTag.version);
    });

    it("should update a release tag", async () => {
      const updated = await client.releases.tags.update(workspaceSlug, releaseTag.id, {
        description: "Updated Release Tag Description",
        git_tag: "refs/tags/v1.0.0",
      });

      expect(updated).toBeDefined();
      expect(updated.id).toBe(releaseTag.id);
      expect(updated.description).toBe("Updated Release Tag Description");
      expect(updated.git_tag).toBe("refs/tags/v1.0.0");
    });

    it("should list release tags", async () => {
      const tags = await client.releases.tags.list(workspaceSlug);

      expect(tags).toBeDefined();
      expect(Array.isArray(tags.results)).toBe(true);

      const found = tags.results.find((t) => t.id === releaseTag.id);
      expect(found).toBeDefined();
    });
  });

  describe("Release Labels", () => {
    it("should create a release label", () => {
      expect(releaseLabel).toBeDefined();
      expect(releaseLabel.id).toBeDefined();
      expect(releaseLabel.name).toContain("Test Release Label");
      expect(releaseLabel.color).toBe("#FF5733");
    });

    it("should retrieve a release label", async () => {
      const retrieved = await client.releases.labels.retrieve(workspaceSlug, releaseLabel.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(releaseLabel.id);
      expect(retrieved.name).toBe(releaseLabel.name);
    });

    it("should update a release label", async () => {
      const updated = await client.releases.labels.update(workspaceSlug, releaseLabel.id, {
        name: randomizeName("Updated Test Release Label "),
        color: "#33FF57",
      });

      expect(updated).toBeDefined();
      expect(updated.id).toBe(releaseLabel.id);
      expect(updated.name).toContain("Updated Test Release Label");
      expect(updated.color).toBe("#33FF57");
    });

    it("should list release labels", async () => {
      const labels = await client.releases.labels.list(workspaceSlug);

      expect(labels).toBeDefined();
      expect(Array.isArray(labels.results)).toBe(true);

      const found = labels.results.find((l) => l.id === releaseLabel.id);
      expect(found).toBeDefined();
    });

    it("should add labels to a release", async () => {
      const labels = await client.releases.labels.addLabels(workspaceSlug, release.id, {
        label_ids: [releaseLabel.id],
      });

      expect(labels).toBeDefined();
      expect(Array.isArray(labels)).toBe(true);
      expect(labels.length).toBeGreaterThan(0);
    });

    it("should list labels on a release", async () => {
      const labels = await client.releases.labels.listLabels(workspaceSlug, release.id);

      expect(labels).toBeDefined();
      expect(Array.isArray(labels.results)).toBe(true);

      const found = labels.results.find((l) => l.id === releaseLabel.id);
      expect(found).toBeDefined();
    });

    it("should remove labels from a release", async () => {
      await client.releases.labels.removeLabels(workspaceSlug, release.id, {
        label_ids: [releaseLabel.id],
      });

      const labels = await client.releases.labels.listLabels(workspaceSlug, release.id);
      const found = labels.results.find((l) => l.id === releaseLabel.id);
      expect(found).toBeUndefined();
    });
  });

  describe("Release Work Items", () => {
    it("should add work items to a release", async () => {
      if (!config.workItemId) {
        return;
      }

      const result = await client.releases.workItems.add(workspaceSlug, release.id, {
        work_item_ids: [config.workItemId],
      });

      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
    });

    it("should list work items in a release", async () => {
      if (!config.workItemId) {
        return;
      }

      const workItems = await client.releases.workItems.list(workspaceSlug, release.id);

      expect(workItems).toBeDefined();
      expect(Array.isArray(workItems.results)).toBe(true);

      const found = workItems.results.find((wi) => wi.id === config.workItemId);
      expect(found).toBeDefined();
      expect(found?.project_id).toBeDefined();
      expect(found?.name).toBeDefined();
    });

    it("should remove work items from a release", async () => {
      if (!config.workItemId) {
        return;
      }

      await client.releases.workItems.remove(workspaceSlug, release.id, {
        work_item_ids: [config.workItemId],
      });

      const workItems = await client.releases.workItems.list(workspaceSlug, release.id);
      const found = workItems.results.find((wi) => wi.id === config.workItemId);
      expect(found).toBeUndefined();
    });
  });

  describe("Release Comments", () => {
    it("should create a release comment", async () => {
      releaseComment = await client.releases.comments.create(workspaceSlug, release.id, {
        comment_html: "<p>Test Release Comment</p>",
      });

      expect(releaseComment).toBeDefined();
      expect(releaseComment.id).toBeDefined();
      expect(releaseComment.release).toBe(release.id);
      expect(releaseComment.comment).toBeDefined();
    });

    it("should retrieve a release comment", async () => {
      const retrieved = await client.releases.comments.retrieve(workspaceSlug, release.id, releaseComment.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(releaseComment.id);
    });

    it("should update a release comment", async () => {
      const updated = await client.releases.comments.update(workspaceSlug, release.id, releaseComment.id, {
        comment_html: "<p>Updated Release Comment</p>",
      });

      expect(updated).toBeDefined();
      expect(updated.id).toBe(releaseComment.id);
    });

    it("should list release comments", async () => {
      const comments = await client.releases.comments.list(workspaceSlug, release.id);

      expect(comments).toBeDefined();
      expect(Array.isArray(comments.results)).toBe(true);

      const found = comments.results.find((c) => c.id === releaseComment.id);
      expect(found).toBeDefined();
    });

    it("should delete a release comment", async () => {
      await client.releases.comments.delete(workspaceSlug, release.id, releaseComment.id);

      const comments = await client.releases.comments.list(workspaceSlug, release.id);
      const found = comments.results.find((c) => c.id === releaseComment.id);
      expect(found).toBeUndefined();
    });
  });

  describe("Release Links", () => {
    it("should create a release link", async () => {
      releaseLink = await client.releases.links.create(workspaceSlug, release.id, {
        title: "Test Release Link",
        url: `https://example.com/${randomizeName("")}`,
      });

      expect(releaseLink).toBeDefined();
      expect(releaseLink.id).toBeDefined();
      expect(releaseLink.release).toBe(release.id);
      expect(releaseLink.title).toBe("Test Release Link");
    });

    it("should retrieve a release link", async () => {
      const retrieved = await client.releases.links.retrieve(workspaceSlug, release.id, releaseLink.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(releaseLink.id);
      expect(retrieved.url).toBe(releaseLink.url);
    });

    it("should update a release link", async () => {
      const updated = await client.releases.links.update(workspaceSlug, release.id, releaseLink.id, {
        title: "Updated Release Link",
      });

      expect(updated).toBeDefined();
      expect(updated.id).toBe(releaseLink.id);
      expect(updated.title).toBe("Updated Release Link");
    });

    it("should list release links", async () => {
      const links = await client.releases.links.list(workspaceSlug, release.id);

      expect(links).toBeDefined();
      expect(Array.isArray(links.results)).toBe(true);

      const found = links.results.find((l) => l.id === releaseLink.id);
      expect(found).toBeDefined();
    });

    it("should delete a release link", async () => {
      await client.releases.links.delete(workspaceSlug, release.id, releaseLink.id);

      const links = await client.releases.links.list(workspaceSlug, release.id);
      const found = links.results.find((l) => l.id === releaseLink.id);
      expect(found).toBeUndefined();
    });
  });
});
