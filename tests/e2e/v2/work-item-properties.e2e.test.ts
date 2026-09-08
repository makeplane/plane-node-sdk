/**
 * `WorkItemProperties` writes require project mode, `WorkspaceWorkItemProperties` writes require workspace mode; each block skips the mode it doesn't need.
 *
 * The property collections themselves are flat (project- and workspace-scoped, one path
 * template each); their options and contexts come off the fetched property row, whose
 * navigation property for options is named **`propertyOptions`**, not `options` — the row
 * already carries an API field called `options`, and `loadRow` refuses to define a
 * navigation property over real data rather than silently hiding it. That rename is the
 * point of this file's option blocks.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";
import { resolveWorkItemTypeMode, skipUnlessMode, WorkItemTypeMode } from "./support/work-item-type-mode";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item properties (live)", () => {
  const suite = useV2Project("wip", env);

  const ws = () => suite.client.v2.workspaces;
  const proj = () => suite.client.v2.workspaces.projects;
  const slug = () => suite.workspaceSlug;
  const project = () => suite.projectId;

  let mode: WorkItemTypeMode;

  beforeAll(async () => {
    mode = await resolveWorkItemTypeMode(suite.client, suite.workspaceSlug);
  });

  describe("WorkItemProperties (project-scoped)", () => {
    const modeReason = "Property definitions are managed at the workspace level for this workspace.";

    it("creates, lists, retrieves, updates, deletes", async () => {
      if (skipUnlessMode(mode, "project", modeReason)) return;

      const properties = proj().workItemProperties;
      const created = await properties.create(slug(), project(), {
        display_name: uniqueName("wip-text"),
        property_type: "TEXT",
      });
      expect(created.id).toBeTruthy();

      try {
        const page = await properties.list(slug(), project());
        expect(page.data.some((row) => row.id === created.id)).toBe(true);

        const fetched = await properties.retrieve(slug(), project(), created.id);
        expect(fetched.property_type).toBe("TEXT");

        const renamed = uniqueName("wip-text-renamed");
        const updated = await properties.update(slug(), project(), created.id, {
          display_name: renamed,
        });
        expect(updated.display_name).toBe(renamed);
      } finally {
        await properties.delete(slug(), project(), created.id).catch(() => undefined);
      }
    });

    describe("options", () => {
      it("creates, lists, retrieves, updates, deletes an option on an OPTION property", async () => {
        if (skipUnlessMode(mode, "project", modeReason)) return;

        const properties = proj().workItemProperties;
        const property = await properties.create(slug(), project(), {
          display_name: uniqueName("wip-option"),
          property_type: "OPTION",
        });

        try {
          // `propertyOptions`, not `options`: the row carries an API field of that name.
          const created = await property.propertyOptions.create({ name: "Alpha" });
          expect(created.id).toBeTruthy();

          const page = await property.propertyOptions.list();
          expect(page.data.some((row) => row.id === created.id)).toBe(true);

          const fetched = await property.propertyOptions.retrieve(created.id);
          expect(fetched.name).toBe("Alpha");

          const updated = await property.propertyOptions.update(created.id, { name: "Beta" });
          expect(updated.name).toBe("Beta");

          await property.propertyOptions.delete(created.id);
          const after = await property.propertyOptions.list();
          expect(after.data.some((row) => row.id === created.id)).toBe(false);
        } finally {
          await properties.delete(slug(), project(), property.id).catch(() => undefined);
        }
      });
    });
  });

  describe("WorkspaceWorkItemProperties", () => {
    const modeReason = "Property definitions are managed at the project level for this workspace.";

    it("creates, lists, retrieves, updates, deletes", async () => {
      if (skipUnlessMode(mode, "workspace", modeReason)) return;

      const properties = ws().workItemProperties;
      const created = await properties.create(slug(), {
        display_name: uniqueName("wwip-text"),
        property_type: "TEXT",
      });
      expect(created.id).toBeTruthy();

      try {
        const page = await properties.list(slug());
        expect(page.data.some((row) => row.id === created.id)).toBe(true);

        const fetched = await properties.retrieve(slug(), created.id);
        expect(fetched.property_type).toBe("TEXT");

        const updated = await properties.update(slug(), created.id, { is_required: true });
        expect(updated.is_required).toBe(true);
      } finally {
        await properties.delete(slug(), created.id).catch(() => undefined);
      }
    });

    describe("contexts", () => {
      it("creates, lists, retrieves, updates, deletes a context applying to everything", async () => {
        if (skipUnlessMode(mode, "workspace", modeReason)) return;

        const properties = ws().workItemProperties;
        const property = await properties.create(slug(), {
          display_name: uniqueName("wwip-ctx"),
          property_type: "TEXT",
        });

        try {
          // Creating a property auto-creates a "Default" catch-all context
          // (confirmed live); it must be deleted before this test can create its own.
          const seeded = await property.contexts.list();
          for (const row of seeded.data) {
            await property.contexts.delete(row.id).catch(() => undefined);
          }

          const created = await property.contexts.create({
            name: uniqueName("wwip-ctx-row"),
            applies_to_all_projects: true,
            applies_to_all_work_item_types: true,
          });
          expect(created.id).toBeTruthy();

          const page = await property.contexts.list();
          expect(page.data.some((row) => row.id === created.id)).toBe(true);

          const fetched = await property.contexts.retrieve(created.id);
          expect(fetched.applies_to_all_projects).toBe(true);

          const updated = await property.contexts.update(created.id, {
            is_required: true,
          });
          expect(updated.is_required).toBe(true);

          await property.contexts.delete(created.id);
          const after = await property.contexts.list();
          expect(after.data.some((row) => row.id === created.id)).toBe(false);
        } finally {
          await properties.delete(slug(), property.id).catch(() => undefined);
        }
      });
    });

    describe("options", () => {
      it("creates, lists, retrieves, updates, deletes an option on an OPTION property", async () => {
        if (skipUnlessMode(mode, "workspace", modeReason)) return;

        const properties = ws().workItemProperties;
        const property = await properties.create(slug(), {
          display_name: uniqueName("wwip-option"),
          property_type: "OPTION",
        });

        try {
          const created = await property.propertyOptions.create({ name: "Gamma" });
          expect(created.id).toBeTruthy();

          const page = await property.propertyOptions.list();
          expect(page.data.some((row) => row.id === created.id)).toBe(true);

          const fetched = await property.propertyOptions.retrieve(created.id);
          expect(fetched.name).toBe("Gamma");

          const updated = await property.propertyOptions.update(created.id, {
            name: "Delta",
          });
          expect(updated.name).toBe("Delta");

          await property.propertyOptions.delete(created.id);
          const after = await property.propertyOptions.list();
          expect(after.data.some((row) => row.id === created.id)).toBe(false);
        } finally {
          await properties.delete(slug(), property.id).catch(() => undefined);
        }
      });
    });
  });
});
