/**
 * Needs the workspace's `is_release_enabled` flag (off by default, 403s otherwise); flipped in `beforeAll` and left on, not restored.
 */
import { uniqueName } from "./support/names";
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 releases (live)", () => {
  const suite = useV2Project("rel", env);

  const releases = () => suite.client.v2.workspace(suite.workspaceSlug).releases;
  const workItems = () => suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId).workItems;

  beforeAll(async () => {
    await suite.client.v2.transport.request("PATCH", `/workspaces/${suite.workspaceSlug}/features/`, {
      data: { is_release_enabled: true },
    });
  });

  describe("CRUD", () => {
    it("creates, retrieves, updates, deletes a release", async () => {
      const created = await releases().create({ name: uniqueName("rel-crud") });
      expect(created.id).toBeDefined();
      expect(created.status).toBe("unreleased");

      try {
        const fetched = await releases().retrieve(created.id);
        expect(fetched.name).toBe(created.name);

        const updated = await releases().update(created.id, { status: "released" });
        expect(updated.status).toBe("released");
      } finally {
        await releases()
          .delete(created.id)
          .catch(() => undefined);
      }

      await expect(releases().retrieve(created.id)).rejects.toThrow();
    });

    it("lists releases and narrows fields", async () => {
      const created = await releases().create({ name: uniqueName("rel-list") });
      try {
        const page = await releases().list({ fields: ["name"] });
        const found = page.data.find((row) => row.id === created.id);
        expect(found).toBeDefined();
        expect(found!.name).toBe(created.name);
      } finally {
        await releases()
          .delete(created.id)
          .catch(() => undefined);
      }
    });
  });

  describe("comments", () => {
    it("creates, retrieves, updates, deletes a comment on a release", async () => {
      const release = await releases().create({ name: uniqueName("rel-comments") });
      try {
        const created = await releases().comments.create(release.id, {
          comment_html: "<p>Shipped.</p>",
        });
        expect(created.id).toBeDefined();

        const fetched = await releases().comments.retrieve(release.id, created.id);
        expect(fetched.comment_html).toContain("Shipped");

        const updated = await releases().comments.update(release.id, created.id, {
          is_resolved: true,
        });
        expect(updated.is_resolved).toBe(true);

        await releases().comments.delete(release.id, created.id);
        const page = await releases().comments.list(release.id);
        expect(page.data.some((row) => row.id === created.id)).toBe(false);
      } finally {
        await releases()
          .delete(release.id)
          .catch(() => undefined);
      }
    });
  });

  describe("links", () => {
    it("creates, retrieves, updates, deletes a link on a release", async () => {
      const release = await releases().create({ name: uniqueName("rel-links") });
      try {
        const created = await releases().links.create(release.id, {
          title: "Release notes",
          url: "https://example.com/notes",
        });
        expect(created.id).toBeDefined();

        const fetched = await releases().links.retrieve(release.id, created.id);
        expect(fetched.url).toBe("https://example.com/notes");

        const updated = await releases().links.update(release.id, created.id, {
          title: "Renamed notes",
        });
        expect(updated.title).toBe("Renamed notes");

        await releases().links.delete(release.id, created.id);
        const page = await releases().links.list(release.id);
        expect(page.data.some((row) => row.id === created.id)).toBe(false);
      } finally {
        await releases()
          .delete(release.id)
          .catch(() => undefined);
      }
    });
  });

  describe("changelog", () => {
    it("auto-creates empty on first GET, then updates", async () => {
      const release = await releases().create({ name: uniqueName("rel-changelog") });
      try {
        const fetched = await releases().changelog.retrieve(release.id);
        expect(fetched.id).toBeDefined();

        const updated = await releases().changelog.update(release.id, {
          description_html: "<p>Fixed things.</p>",
        });
        expect(updated.description_html).toContain("Fixed things");
      } finally {
        await releases()
          .delete(release.id)
          .catch(() => undefined);
      }
    });
  });

  describe("release label/tag definitions", () => {
    it("creates, retrieves, updates, deletes a release label definition", async () => {
      const created = await releases().labels.create({ name: uniqueName("rel-label") });
      try {
        const fetched = await releases().labels.retrieve(created.id);
        expect(fetched.name).toBe(created.name);

        const updated = await releases().labels.update(created.id, { color: "#00ff00" });
        expect(updated.color).toBe("#00ff00");
      } finally {
        await releases()
          .labels.delete(created.id)
          .catch(() => undefined);
      }
    });

    it("creates, retrieves, updates, deletes a release tag definition", async () => {
      const created = await releases().tags.create({ version: uniqueName("1.0.0") });
      try {
        const fetched = await releases().tags.retrieve(created.id);
        expect(fetched.version).toBe(created.version);

        const updated = await releases().tags.update(created.id, { git_tag: "v1.0.0" });
        expect(updated.git_tag).toBe("v1.0.0");
      } finally {
        await releases()
          .tags.delete(created.id)
          .catch(() => undefined);
      }
    });
  });

  describe("manageLabels / manageWorkItems", () => {
    it("attaches and detaches a release label definition via manageLabels", async () => {
      const release = await releases().create({ name: uniqueName("rel-mgmt-labels") });
      const label = await releases().labels.create({ name: uniqueName("rel-mgmt-label") });
      try {
        const added = await releases().manageLabels(release.id, { add: [label.id] });
        expect(added.added).toContain(label.id);

        const afterAdd = await releases().retrieve(release.id);
        expect(afterAdd.label_ids).toContain(label.id);

        const removed = await releases().manageLabels(release.id, { remove: [label.id] });
        expect(removed.removed).toContain(label.id);

        const afterRemove = await releases().retrieve(release.id);
        expect(afterRemove.label_ids ?? []).not.toContain(label.id);
      } finally {
        await releases()
          .labels.delete(label.id)
          .catch(() => undefined);
        await releases()
          .delete(release.id)
          .catch(() => undefined);
      }
    });

    it("attaches a work item via manageWorkItems", async () => {
      const release = await releases().create({ name: uniqueName("rel-mgmt-wi") });
      const workItem = await workItems().create({
        name: uniqueName("rel-mgmt-wi-item"),
      });
      try {
        const result = await releases().manageWorkItems(release.id, { add: [workItem.id] });
        expect(result.added).toContain(workItem.id);
      } finally {
        await workItems()
          .delete(workItem.id)
          .catch(() => undefined);
        await releases()
          .delete(release.id)
          .catch(() => undefined);
      }
    });
  });
});
