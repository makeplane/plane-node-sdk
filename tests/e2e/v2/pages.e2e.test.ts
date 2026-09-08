/**
 * The live server rejects `DELETE` on a page unless archived first, so every delete goes through `archiveAndDelete`.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 pages (live)", () => {
  const suite = useV2Project("pages", env);

  // Project pages navigated off the fetched project row; the wiki (workspace) pages flat,
  // because `wiki` is a grouping node — it consumes no path id of its own, so it is never
  // a navigation property on a row and its children each take the slug themselves.
  const wiki = () => suite.client.v2.workspaces.wiki;
  const slug = () => suite.workspaceSlug;
  const proj = () => suite.projectRow;

  /** Archive (PATCH archived_at + is_locked: false), then delete — the server-mandated order. */
  async function archiveAndDelete(pageId: string): Promise<void> {
    await proj().pages.update(pageId, {
      archived_at: new Date().toISOString(),
      is_locked: false,
    });
    await proj().pages.delete(pageId);
  }

  /** Workspace-path equivalent of {@link archiveAndDelete}. */
  async function archiveAndDeleteWorkspace(pageId: string): Promise<void> {
    await wiki().pages.update(slug(), pageId, {
      archived_at: new Date().toISOString(),
      is_locked: false,
    });
    await wiki().pages.delete(slug(), pageId);
  }

  describe("project-scoped", () => {
    it("creates, retrieves, updates, deletes", async () => {
      const name = uniqueName("page");
      const created = await proj().pages.create({ name });
      expect(created.name).toBe(name);

      const fetched = await proj().pages.retrieve(created.id);
      expect(fetched.id).toBe(created.id);

      const updated = await proj().pages.update(created.id, {
        is_locked: true,
      });
      expect(updated.is_locked).toBe(true);

      await expect(archiveAndDelete(created.id)).resolves.toBeUndefined();
    });

    it("lists and iterates", async () => {
      const created = await proj().pages.create({
        name: uniqueName("page-list"),
      });
      try {
        const page = await proj().pages.list();
        expect(page.data.some((p) => p.id === created.id)).toBe(true);

        const ids: string[] = [];
        for await (const p of proj().pages.iterate()) {
          ids.push(p.id);
        }
        expect(ids).toContain(created.id);
      } finally {
        await archiveAndDelete(created.id).catch(() => undefined);
      }
    });
  });

  describe("workspace-scoped", () => {
    it("creates, retrieves, updates, deletes at the workspace path", async () => {
      const name = uniqueName("wpage");
      const created = await wiki().pages.create(slug(), { name });
      expect(created.name).toBe(name);

      const fetched = await wiki().pages.retrieve(slug(), created.id);
      expect(fetched.id).toBe(created.id);

      const updated = await wiki().pages.update(slug(), created.id, {
        name: `${name}-renamed`,
      });
      expect(updated.name).toBe(`${name}-renamed`);

      await expect(archiveAndDeleteWorkspace(created.id)).resolves.toBeUndefined();
    });

    it("does not include a project-scoped page (only global pages live at the workspace path)", async () => {
      const created = await proj().pages.create({
        name: uniqueName("page-not-in-ws-list"),
      });
      try {
        const page = await wiki().pages.list(slug());
        expect(page.data.some((p) => p.id === created.id)).toBe(false);
      } finally {
        await archiveAndDelete(created.id).catch(() => undefined);
      }
    });

    it("does include a page created at the workspace path", async () => {
      const created = await wiki().pages.create(slug(), {
        name: uniqueName("page-in-ws-list"),
      });
      try {
        const page = await wiki().pages.list(slug());
        expect(page.data.some((p) => p.id === created.id)).toBe(true);
      } finally {
        await archiveAndDeleteWorkspace(created.id).catch(() => undefined);
      }
    });
  });
});
