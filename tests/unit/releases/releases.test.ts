import { PlaneClient } from "../../../src/client/plane-client";
import { Release, ReleaseLabel, ReleaseTag } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!config.workspaceSlug, "Releases API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let release: Release;
  let tag: ReleaseTag;
  let label: ReleaseLabel;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    // Note: Releases API may not expose a delete endpoint — skip if absent
  });

  // ─── Releases ────────────────────────────────────────────────────────────────

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
      name: randomizeName("Test Tag"),
      color: "#FF5733",
    });
    expect(tag).toBeDefined();
    expect(tag.id).toBeDefined();
    expect(tag.name).toContain("Test Tag");
  });

  it("should list release tags", async () => {
    const tags = await client.releases.tags.list(workspaceSlug);
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.find((t) => t.id === tag.id)).toBeDefined();
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
    const labels = await client.releases.labels.list(workspaceSlug);
    expect(Array.isArray(labels)).toBe(true);
    expect(labels.find((l) => l.id === label.id)).toBeDefined();
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
  });

  it("should remove a label from a release", async () => {
    await expect(client.releases.itemLabels.del(workspaceSlug, release.id!, label.id!)).resolves.toBeUndefined();
  });
});
