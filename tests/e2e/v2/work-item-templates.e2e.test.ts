/**
 * Two path templates, one family: project-scoped templates come off the fetched project
 * row, workspace-scoped ones are flat with the slug per call.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("WorkItemTemplates (v2, live)", () => {
  const suite = useV2Project("templates", env);
  const ws = () => suite.client.v2.workspaces;
  const slug = () => suite.workspaceSlug;
  const proj = () => suite.projectRow;

  describe("project-scoped", () => {
    it("creates, retrieves, updates, uses, then deletes a template", async () => {
      const name = uniqueName("template");
      const created = await proj().workItemTemplates.create({
        name,
        template_data: { name: "Untitled from template" },
      });

      try {
        const retrieved = await proj().workItemTemplates.retrieve(created.id);
        expect(retrieved.name).toBe(name);

        const updated = await proj().workItemTemplates.update(created.id, { is_published: true });
        expect(updated.is_published).toBe(true);

        const workItem = await proj().workItemTemplates.use(created.id, { name: uniqueName("from-template") });
        expect(workItem.id).toBeTruthy();

        await proj().workItems.delete(workItem.id);
      } finally {
        await proj()
          .workItemTemplates.delete(created.id)
          .catch(() => undefined);
      }
    });

    it("lists templates in the project", async () => {
      const name = uniqueName("template-list");
      const created = await proj().workItemTemplates.create({
        name,
        template_data: { name: "Untitled" },
      });

      try {
        const page = await proj().workItemTemplates.list({ search: name });
        expect(page.data.some((template) => template.id === created.id)).toBe(true);
      } finally {
        await proj()
          .workItemTemplates.delete(created.id)
          .catch(() => undefined);
      }
    });
  });

  describe("workspace-scoped", () => {
    it("creates, retrieves, updates, then deletes a workspace template", async () => {
      const name = uniqueName("ws-template");
      const created = await ws().workItemTemplates.create(slug(), {
        name,
        template_data: { name: "Untitled" },
      });

      try {
        const retrieved = await ws().workItemTemplates.retrieve(slug(), created.id);
        expect(retrieved.name).toBe(name);

        const updated = await ws().workItemTemplates.update(slug(), created.id, {
          is_published: true,
        });
        expect(updated.is_published).toBe(true);
      } finally {
        await ws()
          .workItemTemplates.delete(slug(), created.id)
          .catch(() => undefined);
      }
    });
  });
});
