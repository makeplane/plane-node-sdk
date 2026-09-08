/**
 * Project-scoped `ProjectViews` and workspace-scoped `WorkspaceViews` use different path templates, so both get full coverage here.
 *
 * The project half is driven navigated (off the suite's fetched project row) and the
 * workspace half flat, so the two path templates are each reached the way a caller most
 * naturally would.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Views (v2, live)", () => {
  const suite = useV2Project("views", env);

  describe("project-scoped", () => {
    it("creates, retrieves, lists, updates, then deletes a view", async () => {
      const proj = suite.projectRow;
      const name = uniqueName("view");
      const created = await proj.views.create({ name });

      try {
        const retrieved = await proj.views.retrieve(created.id);
        expect(retrieved.name).toBe(name);

        const page = await proj.views.list({ search: name });
        expect(page.data.some((view) => view.id === created.id)).toBe(true);

        const updated = await proj.views.update(created.id, { is_locked: true });
        expect(updated.is_locked).toBe(true);
      } finally {
        await proj.views.delete(created.id).catch(() => undefined);
      }
    });

    it("retrieves by project uuid and by identifier consistently", async () => {
      const proj = suite.projectRow;
      const created = await proj.views.create({ name: uniqueName("view-key") });

      try {
        // The navigated row is already bound to whichever key `rowId` picked, so the
        // uuid/identifier equivalence can only be asserted flat.
        const byId = await suite.client.v2.projects.views.retrieve(suite.workspaceSlug, suite.projectId, created.id);
        const byKey = await suite.client.v2.projects.views.retrieve(suite.workspaceSlug, suite.projectKey, created.id);
        expect(byId.id).toBe(byKey.id);
      } finally {
        await proj.views.delete(created.id).catch(() => undefined);
      }
    });
  });

  describe("workspace-scoped (project IS NULL)", () => {
    const ws = () => suite.client.v2.workspaces;
    const slug = () => suite.workspaceSlug;

    it("creates, retrieves, lists, updates, then deletes a workspace view", async () => {
      const name = uniqueName("ws-view");
      const created = await ws().views.create(slug(), { name });

      try {
        const retrieved = await ws().views.retrieve(slug(), created.id);
        expect(retrieved.name).toBe(name);

        const page = await ws().views.list(slug(), { search: name });
        expect(page.data.some((view) => view.id === created.id)).toBe(true);

        const updated = await ws().views.update(slug(), created.id, {
          is_locked: true,
        });
        expect(updated.is_locked).toBe(true);
      } finally {
        await ws()
          .views.delete(slug(), created.id)
          .catch(() => undefined);
      }
    });

    it("does not appear in the project-scoped list (project IS NULL for a workspace view)", async () => {
      const name = uniqueName("ws-view-scope");
      const created = await ws().views.create(slug(), { name });

      try {
        const projectPage = await suite.projectRow.views.list({
          search: name,
        });
        expect(projectPage.data.some((view) => view.id === created.id)).toBe(false);
      } finally {
        await ws()
          .views.delete(slug(), created.id)
          .catch(() => undefined);
      }
    });
  });
});
