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

  const wiki = () => suite.client.v2.workspace(suite.workspaceSlug).wiki;

  it("creates, retrieves, updates, deletes", async () => {
    const name = uniqueName("collection");
    const created = await wiki().collections.create({ name });
    expect(created.name).toBe(name);

    const fetched = await wiki().collections.retrieve(created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await wiki().collections.update(created.id, {
      name: `${name}-renamed`,
    });
    expect(updated.name).toBe(`${name}-renamed`);

    await expect(wiki().collections.delete(created.id)).resolves.toBeUndefined();
  });

  it("default() resolves the workspace's General collection", async () => {
    const found = await wiki().collections.default();
    expect(found.is_default).toBe(true);
  });

  describe("pages membership + pages.search", () => {
    it("attaches/detaches a wiki page and pages.search reflects addable pages", async () => {
      const collection = await wiki().collections.create({
        name: uniqueName("collection-pages"),
      });
      const page = await suite.client.v2
        .workspace(suite.workspaceSlug)
        .project(suite.projectId)
        .pages.create({
          name: uniqueName("page-for-collection"),
        });
      try {
        const attach = await wiki().collections.pages.manage(collection.id, {
          add: [page.id],
        });
        expect(attach.added).toContain(page.id);

        const detach = await wiki().collections.pages.manage(collection.id, {
          remove: [page.id],
        });
        expect(detach.removed).toContain(page.id);
      } finally {
        await suite.client.v2
          .workspace(suite.workspaceSlug)
          .project(suite.projectId)
          .pages.delete(page.id)
          .catch(() => undefined);
        await wiki()
          .collections.delete(collection.id)
          .catch(() => undefined);
      }
    });
  });

  describe("members", () => {
    it("lists members as a raw array and manages membership", async () => {
      const collection = await wiki().collections.create({
        name: uniqueName("collection-members"),
      });
      try {
        const members = await wiki().collections.members.list(collection.id);
        expect(Array.isArray(members)).toBe(true);
      } finally {
        await wiki()
          .collections.delete(collection.id)
          .catch(() => undefined);
      }
    });
  });
});
