/**
 * Project-scoped `ProjectViews` and workspace-scoped `WorkspaceViews` use different path templates, so both get full coverage here.
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
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
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
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.views.create({ name: uniqueName("view-key") });

      try {
        const byId = await proj.views.retrieve(created.id);
        const byKey = await suite.client.v2
          .workspace(suite.workspaceSlug)
          .project(suite.projectKey)
          .views.retrieve(created.id);
        expect(byId.id).toBe(byKey.id);
      } finally {
        await proj.views.delete(created.id).catch(() => undefined);
      }
    });
  });

  describe("workspace-scoped (project IS NULL)", () => {
    const ws = () => suite.client.v2.workspace(suite.workspaceSlug);

    it("creates, retrieves, lists, updates, then deletes a workspace view", async () => {
      const name = uniqueName("ws-view");
      const created = await ws().views.create({ name });

      try {
        const retrieved = await ws().views.retrieve(created.id);
        expect(retrieved.name).toBe(name);

        const page = await ws().views.list({ search: name });
        expect(page.data.some((view) => view.id === created.id)).toBe(true);

        const updated = await ws().views.update(created.id, {
          is_locked: true,
        });
        expect(updated.is_locked).toBe(true);
      } finally {
        await ws()
          .views.delete(created.id)
          .catch(() => undefined);
      }
    });

    it("does not appear in the project-scoped list (project IS NULL for a workspace view)", async () => {
      const name = uniqueName("ws-view-scope");
      const created = await ws().views.create({ name });

      try {
        const projectPage = await ws().project(suite.projectId).views.list({
          search: name,
        });
        expect(projectPage.data.some((view) => view.id === created.id)).toBe(false);
      } finally {
        await ws()
          .views.delete(created.id)
          .catch(() => undefined);
      }
    });
  });
});
