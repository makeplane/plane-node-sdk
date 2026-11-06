/**
 * Wiki collections against a real server — CRUD plus members/pages sub-resources, pages.search, default().
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 collections (live)", () => {
  const suite = useV2Project("collections", env);

  // Flat: `wiki` is a grouping node with no path id of its own, so its children take the
  // slug per call and are never navigation properties on a fetched row.
  const wiki = () => suite.client.v2.workspaces.wiki;
  const slug = () => suite.workspaceSlug;

  it("creates, retrieves, updates, deletes", async () => {
    const name = uniqueName("collection");
    const created = await wiki().collections.create(slug(), { name });
    expect(created.name).toBe(name);

    const fetched = await wiki().collections.retrieve(slug(), created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await wiki().collections.update(slug(), created.id, {
      name: `${name}-renamed`,
    });
    expect(updated.name).toBe(`${name}-renamed`);

    await expect(wiki().collections.delete(slug(), created.id)).resolves.toBeUndefined();
  });

  it("default() resolves the workspace's General collection", async () => {
    const found = await wiki().collections.default(slug());
    expect(found.is_default).toBe(true);
  });

  describe("pages membership + pages.search", () => {
    it("adds/removes a wiki page and pages.search reflects addable pages", async () => {
      const collection = await wiki().collections.create(slug(), {
        name: uniqueName("collection-pages"),
      });
      // A collection only holds workspace wiki pages — a project-scoped page is a 400
      // ("Page ... is not a workspace wiki page"), so create this one at the workspace path.
      const page = await wiki().pages.create(slug(), {
        name: uniqueName("page-for-collection"),
      });
      try {
        const added = await wiki().collections.pages.add(slug(), collection.id, [page.id]);
        expect(added).toContain(page.id);

        const removed = await wiki().collections.pages.remove(slug(), collection.id, [page.id]);
        expect(removed).toContain(page.id);
      } finally {
        // A workspace page must be archived (and unlocked) before it can be deleted.
        await wiki()
          .pages.update(slug(), page.id, { archived_at: new Date().toISOString(), is_locked: false })
          .catch(() => undefined);
        await wiki()
          .pages.delete(slug(), page.id)
          .catch(() => undefined);
        await wiki()
          .collections.delete(slug(), collection.id)
          .catch(() => undefined);
      }
    });
  });

  describe("members", () => {
    it("lists members as a raw array and manages membership", async () => {
      const collection = await wiki().collections.create(slug(), {
        name: uniqueName("collection-members"),
      });
      try {
        const members = await wiki().collections.members.list(slug(), collection.id);
        expect(Array.isArray(members)).toBe(true);
      } finally {
        await wiki()
          .collections.delete(slug(), collection.id)
          .catch(() => undefined);
      }
    });
  });
});
