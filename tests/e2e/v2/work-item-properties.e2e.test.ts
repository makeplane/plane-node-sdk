/**
 * `WorkItemProperties` writes require project mode, `WorkspaceWorkItemProperties` writes require workspace mode; each block skips the mode it doesn't need.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";
import { resolveWorkItemTypeMode, skipUnlessMode, WorkItemTypeMode } from "./support/work-item-type-mode";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item properties (live)", () => {
  const suite = useV2Project("wip", env);

  const ws = () => suite.client.v2.workspace(suite.workspaceSlug);
  const proj = () => ws().project(suite.projectId);

  let mode: WorkItemTypeMode;

  beforeAll(async () => {
    mode = await resolveWorkItemTypeMode(suite.client, suite.workspaceSlug);
  });

  describe("WorkItemProperties (project-scoped)", () => {
    const modeReason = "Property definitions are managed at the workspace level for this workspace.";

    it("creates, lists, retrieves, updates, deletes", async () => {
      if (skipUnlessMode(mode, "project", modeReason)) return;

      const properties = proj().workItemProperties;
      const created = await properties.create({
        display_name: uniqueName("wip-text"),
        property_type: "TEXT",
      });
      expect(created.id).toBeTruthy();

      try {
        const page = await properties.list();
        expect(page.data.some((row) => row.id === created.id)).toBe(true);

        const fetched = await properties.retrieve(created.id);
        expect(fetched.property_type).toBe("TEXT");

        const renamed = uniqueName("wip-text-renamed");
        const updated = await properties.update(created.id, {
          display_name: renamed,
        });
        expect(updated.display_name).toBe(renamed);
      } finally {
        await properties.delete(created.id).catch(() => undefined);
      }
    });

    describe("options", () => {
      it("creates, lists, retrieves, updates, deletes an option on an OPTION property", async () => {
        if (skipUnlessMode(mode, "project", modeReason)) return;

        const properties = proj().workItemProperties;
        const property = await properties.create({
          display_name: uniqueName("wip-option"),
          property_type: "OPTION",
        });

        try {
          const created = await properties.options.create(property.id, {
            name: "Alpha",
          });
          expect(created.id).toBeTruthy();

          const page = await properties.options.list(property.id);
          expect(page.data.some((row) => row.id === created.id)).toBe(true);

          const fetched = await properties.options.retrieve(property.id, created.id);
          expect(fetched.name).toBe("Alpha");

          const updated = await properties.options.update(property.id, created.id, { name: "Beta" });
          expect(updated.name).toBe("Beta");

          await properties.options.delete(property.id, created.id);
          const after = await properties.options.list(property.id);
          expect(after.data.some((row) => row.id === created.id)).toBe(false);
        } finally {
          await properties.delete(property.id).catch(() => undefined);
        }
      });
    });
  });

  describe("WorkspaceWorkItemProperties", () => {
    const modeReason = "Property definitions are managed at the project level for this workspace.";

    it("creates, lists, retrieves, updates, deletes", async () => {
      if (skipUnlessMode(mode, "workspace", modeReason)) return;

      const properties = ws().workItemProperties;
      const created = await properties.create({
        display_name: uniqueName("wwip-text"),
        property_type: "TEXT",
      });
      expect(created.id).toBeTruthy();

      try {
        const page = await properties.list();
        expect(page.data.some((row) => row.id === created.id)).toBe(true);

        const fetched = await properties.retrieve(created.id);
        expect(fetched.property_type).toBe("TEXT");

        const updated = await properties.update(created.id, { is_required: true });
        expect(updated.is_required).toBe(true);
      } finally {
        await properties.delete(created.id).catch(() => undefined);
      }
    });

    describe("contexts", () => {
      it("creates, lists, retrieves, updates, deletes a context applying to everything", async () => {
        if (skipUnlessMode(mode, "workspace", modeReason)) return;

        const properties = ws().workItemProperties;
        const property = await properties.create({
          display_name: uniqueName("wwip-ctx"),
          property_type: "TEXT",
        });

        try {
          // Creating a property auto-creates a "Default" catch-all context
          // (confirmed live); it must be deleted before this test can create its own.
          const seeded = await properties.contexts.list(property.id);
          for (const row of seeded.data) {
            await properties.contexts.delete(property.id, row.id).catch(() => undefined);
          }

          const created = await properties.contexts.create(property.id, {
            name: uniqueName("wwip-ctx-row"),
            applies_to_all_projects: true,
            applies_to_all_work_item_types: true,
          });
          expect(created.id).toBeTruthy();

          const page = await properties.contexts.list(property.id);
          expect(page.data.some((row) => row.id === created.id)).toBe(true);

          const fetched = await properties.contexts.retrieve(property.id, created.id);
          expect(fetched.applies_to_all_projects).toBe(true);

          const updated = await properties.contexts.update(property.id, created.id, {
            is_required: true,
          });
          expect(updated.is_required).toBe(true);

          await properties.contexts.delete(property.id, created.id);
          const after = await properties.contexts.list(property.id);
          expect(after.data.some((row) => row.id === created.id)).toBe(false);
        } finally {
          await properties.delete(property.id).catch(() => undefined);
        }
      });
    });

    describe("options", () => {
      it("creates, lists, retrieves, updates, deletes an option on an OPTION property", async () => {
        if (skipUnlessMode(mode, "workspace", modeReason)) return;

        const properties = ws().workItemProperties;
        const property = await properties.create({
          display_name: uniqueName("wwip-option"),
          property_type: "OPTION",
        });

        try {
          const created = await properties.options.create(property.id, { name: "Gamma" });
          expect(created.id).toBeTruthy();

          const page = await properties.options.list(property.id);
          expect(page.data.some((row) => row.id === created.id)).toBe(true);

          const fetched = await properties.options.retrieve(property.id, created.id);
          expect(fetched.name).toBe("Gamma");

          const updated = await properties.options.update(property.id, created.id, {
            name: "Delta",
          });
          expect(updated.name).toBe("Delta");

          await properties.options.delete(property.id, created.id);
          const after = await properties.options.list(property.id);
          expect(after.data.some((row) => row.id === created.id)).toBe(false);
        } finally {
          await properties.delete(property.id).catch(() => undefined);
        }
      });
    });
  });
});
