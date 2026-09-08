/**
 * Needs the workspace's `is_release_enabled` flag (off by default, 403s otherwise); flipped in `beforeAll` and left on, not restored.
 *
 * Two catalogs and one collection, and the split matters. `releases` and the
 * `releaseLabels`/`releaseTags` catalogs each take the slug alone, so their own CRUD is
 * flat. A release's comments, links, changelog, work items and label *attachments* carry
 * the release id, so they come off the fetched release row.
 *
 * `releaseTags` moved: it is `v2.workspaces.releaseTags`, not `releases.tags`. A release
 * points at a tag through its own `tag_id` and every tag route takes the slug alone, so
 * the tag catalog is a sibling of releases rather than a child — the URL is what decides,
 * and nesting it under `releases` would have implied a path segment that does not exist.
 */
import { uniqueName } from "./support/names";
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 releases (live)", () => {
  const suite = useV2Project("rel", env);

  const releases = () => suite.client.v2.workspaces.releases;
  const releaseLabels = () => suite.client.v2.workspaces.releases.labels;
  const releaseTags = () => suite.client.v2.workspaces.releaseTags;
  const workItems = () => suite.projectRow.workItems;
  const slug = () => suite.workspaceSlug;

  beforeAll(async () => {
    await suite.client.v2.workspaces.features.update(suite.workspaceSlug, { is_release_enabled: true });
  });

  describe("CRUD", () => {
    it("creates, retrieves, updates, deletes a release", async () => {
      const created = await releases().create(slug(), { name: uniqueName("rel-crud") });
      expect(created.id).toBeDefined();
      expect(created.status).toBe("unreleased");

      try {
        const fetched = await releases().retrieve(slug(), created.id);
        expect(fetched.name).toBe(created.name);

        const updated = await releases().update(slug(), created.id, { status: "released" });
        expect(updated.status).toBe("released");
      } finally {
        await releases()
          .delete(slug(), created.id)
          .catch(() => undefined);
      }

      await expect(releases().retrieve(slug(), created.id)).rejects.toThrow();
    });

    it("lists releases and narrows fields", async () => {
      const created = await releases().create(slug(), { name: uniqueName("rel-list") });
      try {
        const page = await releases().list(slug(), { fields: ["name"] });
        const found = page.data.find((row) => row.id === created.id);
        expect(found).toBeDefined();
        expect(found!.name).toBe(created.name);
      } finally {
        await releases()
          .delete(slug(), created.id)
          .catch(() => undefined);
      }
    });
  });

  describe("comments", () => {
    it("creates, retrieves, updates, deletes a comment on a release", async () => {
      const release = await releases().create(slug(), { name: uniqueName("rel-comments") });
      try {
        const created = await release.comments.create({
          comment_html: "<p>Shipped.</p>",
        });
        expect(created.id).toBeDefined();

        const fetched = await release.comments.retrieve(created.id);
        expect(fetched.comment_html).toContain("Shipped");

        const updated = await release.comments.update(created.id, {
          is_resolved: true,
        });
        expect(updated.is_resolved).toBe(true);

        await release.comments.delete(created.id);
        const page = await release.comments.list();
        expect(page.data.some((row) => row.id === created.id)).toBe(false);
      } finally {
        await releases()
          .delete(slug(), release.id)
          .catch(() => undefined);
      }
    });
  });

  describe("links", () => {
    it("creates, retrieves, updates, deletes a link on a release", async () => {
      const release = await releases().create(slug(), { name: uniqueName("rel-links") });
      try {
        const created = await release.links.create({
          title: "Release notes",
          url: "https://example.com/notes",
        });
        expect(created.id).toBeDefined();

        const fetched = await release.links.retrieve(created.id);
        expect(fetched.url).toBe("https://example.com/notes");

        const updated = await release.links.update(created.id, {
          title: "Renamed notes",
        });
        expect(updated.title).toBe("Renamed notes");

        await release.links.delete(created.id);
        const page = await release.links.list();
        expect(page.data.some((row) => row.id === created.id)).toBe(false);
      } finally {
        await releases()
          .delete(slug(), release.id)
          .catch(() => undefined);
      }
    });
  });

  describe("changelog", () => {
    it("auto-creates empty on first GET, then updates", async () => {
      const release = await releases().create(slug(), { name: uniqueName("rel-changelog") });
      try {
        const fetched = await release.changelog.retrieve();
        expect(fetched.id).toBeDefined();

        const updated = await release.changelog.update({
          description_html: "<p>Fixed things.</p>",
        });
        expect(updated.description_html).toContain("Fixed things");
      } finally {
        await releases()
          .delete(slug(), release.id)
          .catch(() => undefined);
      }
    });
  });

  describe("release label/tag definitions", () => {
    it("creates, retrieves, updates, deletes a release label definition", async () => {
      const created = await releaseLabels().create(slug(), { name: uniqueName("rel-label") });
      try {
        const fetched = await releaseLabels().retrieve(slug(), created.id);
        expect(fetched.name).toBe(created.name);

        const updated = await releaseLabels().update(slug(), created.id, { color: "#00ff00" });
        expect(updated.color).toBe("#00ff00");
      } finally {
        await releaseLabels()
          .delete(slug(), created.id)
          .catch(() => undefined);
      }
    });

    it("creates, retrieves, updates, deletes a release tag definition", async () => {
      const created = await releaseTags().create(slug(), { version: uniqueName("1.0.0") });
      try {
        const fetched = await releaseTags().retrieve(slug(), created.id);
        expect(fetched.version).toBe(created.version);

        const updated = await releaseTags().update(slug(), created.id, { git_tag: "v1.0.0" });
        expect(updated.git_tag).toBe("v1.0.0");
      } finally {
        await releaseTags()
          .delete(slug(), created.id)
          .catch(() => undefined);
      }
    });
  });

  describe("labels.add/remove / workItems.add/remove", () => {
    it("adds and removes a release label definition via labels.add/remove", async () => {
      const release = await releases().create(slug(), { name: uniqueName("rel-mgmt-labels") });
      const label = await releaseLabels().create(slug(), { name: uniqueName("rel-mgmt-label") });
      try {
        const added = await release.labels.add([label.id]);
        expect(added).toContain(label.id);

        const afterAdd = await releases().retrieve(slug(), release.id);
        expect(afterAdd.label_ids).toContain(label.id);

        const removed = await release.labels.remove([label.id]);
        expect(removed).toContain(label.id);

        const afterRemove = await releases().retrieve(slug(), release.id);
        expect(afterRemove.label_ids ?? []).not.toContain(label.id);
      } finally {
        await releaseLabels()
          .delete(slug(), label.id)
          .catch(() => undefined);
        await releases()
          .delete(slug(), release.id)
          .catch(() => undefined);
      }
    });

    it("adds a work item via workItems.add", async () => {
      const release = await releases().create(slug(), { name: uniqueName("rel-mgmt-wi") });
      const workItem = await workItems().create({
        name: uniqueName("rel-mgmt-wi-item"),
      });
      try {
        const result = await release.workItems.add([workItem.id]);
        expect(result).toContain(workItem.id);
      } finally {
        await workItems()
          .delete(workItem.id)
          .catch(() => undefined);
        await releases()
          .delete(slug(), release.id)
          .catch(() => undefined);
      }
    });
  });
});
