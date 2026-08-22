/**
 * `markDefault` restores the prior default in a `finally` before delete: a default type 409s on delete, confirmed live.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { WorkItemType } from "../../../src/models/v2/WorkItemType";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";
import { resolveWorkItemTypeMode, skipUnlessMode, WorkItemTypeMode } from "./support/work-item-type-mode";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item types (live)", () => {
  const suite = useV2Project("wit", env);

  const ws = () => suite.client.v2.workspace(suite.workspaceSlug);
  const proj = () => ws().project(suite.projectId);

  let mode: WorkItemTypeMode;

  beforeAll(async () => {
    mode = await resolveWorkItemTypeMode(suite.client, suite.workspaceSlug);
  });

  /**
   * In workspace mode, a freshly created type isn't visible to any project until `import` populates `ProjectIssueType` for it.
   */
  async function createAccessibleType(name: string): Promise<WorkItemType> {
    if (mode === "workspace") {
      const created = await ws().workItemTypes.create({ name });
      await proj().workItemTypes.import([created.id]);
      return created;
    }
    return proj().workItemTypes.create({ name });
  }

  /** Delete a row created by {@link createAccessibleType}, best-effort. */
  async function deleteAccessibleType(typeId: string): Promise<void> {
    await (mode === "workspace" ? ws().workItemTypes.delete(typeId) : proj().workItemTypes.delete(typeId)).catch(
      () => undefined
    );
  }

  describe("CRUD (project-scoped)", () => {
    it("creates, retrieves, updates, and deletes a work item type", async () => {
      if (mode === "workspace") {
        // Project-level writes are locked out once the workspace owns work item
        // types — assert the real 409 instead of assuming project mode.
        await expect(proj().workItemTypes.create({ name: uniqueName("wit-crud") })).rejects.toMatchObject<
          Partial<PlaneApiError>
        >({ status: 409, code: "work_item_types_managed_at_workspace" });
        return;
      }

      const created = await proj().workItemTypes.create({ name: uniqueName("wit-crud") });
      expect(created.id).toBeDefined();

      const fetched = await proj().workItemTypes.retrieve(created.id);
      expect(fetched.name).toBe(created.name);

      const updated = await proj().workItemTypes.update(created.id, {
        description: "Renamed via SDK e2e",
      });
      expect(updated.description).toBe("Renamed via SDK e2e");

      await proj().workItemTypes.delete(created.id);
      await expect(proj().workItemTypes.retrieve(created.id)).rejects.toMatchObject<Partial<PlaneApiError>>({
        status: 404,
      });
    });

    it("lists and narrows fields", async () => {
      // A read: works in either mode, and a project surfaces its workspace-owned
      // types too (see this file's own top-of-file note) — only the *creation*
      // path needs to target the mode that's actually writable.
      const created = await createAccessibleType(uniqueName("wit-list"));
      try {
        const page = await proj().workItemTypes.list({ fields: ["id", "name"] });
        const found = page.data.find((row) => row.id === created.id);
        expect(found).toBeDefined();
        expect(found!.name).toBeDefined();
        // @ts-expect-error `is_active` was not requested, so it is not on the narrowed type
        expect(found!.is_active).toBeUndefined();
      } finally {
        await deleteAccessibleType(created.id);
      }
    });

    it("finds by name", async () => {
      const name = uniqueName("wit-find");
      const created = await createAccessibleType(name);
      try {
        const found = await proj().workItemTypes.findByName(name);
        expect(found.id).toBe(created.id);
      } finally {
        await deleteAccessibleType(created.id);
      }
    });
  });

  describe("markDefault", () => {
    it("marks a type as the default, then restores the prior default", async () => {
      const priorDefault = (await proj().workItemTypes.list()).data.find((row) => row.is_default);
      const created = await createAccessibleType(uniqueName("wit-default"));
      try {
        const marked =
          mode === "workspace"
            ? await ws().workItemTypes.markDefault(created.id)
            : await proj().workItemTypes.markDefault(created.id);
        expect(marked.is_default).toBe(true);
      } finally {
        if (priorDefault) {
          await (
            mode === "workspace"
              ? ws().workItemTypes.markDefault(priorDefault.id)
              : proj().workItemTypes.markDefault(priorDefault.id)
          ).catch(() => undefined);
        }
        // Only deletable once it's no longer the default — see this file's own
        // top-of-file note on `markDefault`.
        await deleteAccessibleType(created.id);
      }
    });
  });

  describe("schema", () => {
    it("returns the type's writable-field schema", async () => {
      // `schema` is project-scoped only in the golden, but reads are
      // mode-unaffected: a workspace type is visible via the project path either way.
      const created = await createAccessibleType(uniqueName("wit-schema"));
      try {
        const schema = await proj().workItemTypes.schema(created.id);
        expect(schema.type_id).toBe(created.id);
        expect(schema.fields).toBeDefined();
      } finally {
        await deleteAccessibleType(created.id);
      }
    });
  });

  describe("enable", () => {
    it("is idempotent: enabling twice does not error, and the project ends up with an Epic type", async () => {
      // `enable` has no workspace-level golden equivalent; its
      // `require_mode(required="project")` 409s once the workspace owns types.
      if (skipUnlessMode(mode, "project", "`enable` has no workspace-level equivalent in the golden.")) return;

      await proj().workItemTypes.enable();
      const enabledAgain = await proj().workItemTypes.enable();
      expect(enabledAgain.is_epic).toBe(true);

      const page = await proj().workItemTypes.list();
      expect(page.data.some((row) => row.is_epic)).toBe(true);
    });
  });

  describe("workspace-scoped", () => {
    it("creates, retrieves, updates, deletes, and marks default at the workspace path", async () => {
      // The workspace-scoped viewset requires mode==="workspace"; there is no way
      // to create a workspace-level type while the workspace runs in project mode.
      if (skipUnlessMode(mode, "workspace", "Workspace-scoped type writes require workspace mode.")) return;

      const created = await ws().workItemTypes.create({ name: uniqueName("wswit-crud") });
      try {
        const fetched = await ws().workItemTypes.retrieve(created.id);
        expect(fetched.name).toBe(created.name);

        const updated = await ws().workItemTypes.update(created.id, { description: "Updated" });
        expect(updated.description).toBe("Updated");

        const priorDefault = (await ws().workItemTypes.list()).data.find((row) => row.is_default);
        const marked = await ws().workItemTypes.markDefault(created.id);
        expect(marked.is_default).toBe(true);
        // Restore the prior default before the `finally` below tries to delete
        // `created` — a default type can't be deleted (see this file's own
        // top-of-file note).
        if (priorDefault) {
          await ws()
            .workItemTypes.markDefault(priorDefault.id)
            .catch(() => undefined);
        }
      } finally {
        await ws()
          .workItemTypes.delete(created.id)
          .catch(() => undefined);
      }
    });

    it("lists at the workspace path and finds the created row", async () => {
      if (skipUnlessMode(mode, "workspace", "Workspace-scoped type writes require workspace mode.")) return;

      const created = await ws().workItemTypes.create({ name: uniqueName("wswit-list") });
      try {
        const page = await ws().workItemTypes.list();
        expect(page.data.some((row) => row.id === created.id)).toBe(true);
      } finally {
        await ws().workItemTypes.delete(created.id);
      }
    });
  });

  describe("import", () => {
    it("imports a workspace-level type into the project without throwing", async () => {
      // `import` is the mirror image of `enable`: its own `require_mode(required=
      // "workspace")` means it 409s unconditionally in project mode — importing
      // FROM the workspace level only makes sense once the workspace owns types.
      if (
        skipUnlessMode(
          mode,
          "workspace",
          "`import` requires workspace mode (importing a workspace type into a project)."
        )
      ) {
        return;
      }

      const workspaceType = await ws().workItemTypes.create({ name: uniqueName("wit-import") });
      try {
        await expect(proj().workItemTypes.import([workspaceType.id])).resolves.toBeUndefined();
      } finally {
        await ws()
          .workItemTypes.delete(workspaceType.id)
          .catch(() => undefined);
        // Best-effort: `import` may have copied the type into the project under a new id;
        // clean it up by name so it doesn't linger past this test.
        const imported = (await proj().workItemTypes.list()).data.find((row) => row.name === workspaceType.name);
        if (imported) {
          await proj()
            .workItemTypes.delete(imported.id)
            .catch(() => undefined);
        }
      }
    });
  });

  describe("properties (attach/detach)", () => {
    it("attaches then detaches a property", async () => {
      const type = await createAccessibleType(uniqueName("wit-prop"));
      const property =
        mode === "workspace"
          ? await ws().workItemProperties.create({
              display_name: uniqueName("wit-prop-field"),
              property_type: "TEXT",
            })
          : await proj().workItemProperties.create({
              display_name: uniqueName("wit-prop-field"),
              property_type: "TEXT",
            });
      try {
        const attached =
          mode === "workspace"
            ? await ws().workItemTypes.properties.attach(type.id, [property.id])
            : await proj().workItemTypes.properties.attach(type.id, [property.id]);
        expect(attached.properties).toContain(property.id);

        const page =
          mode === "workspace"
            ? await ws().workItemTypes.properties.list(type.id)
            : await proj().workItemTypes.properties.list(type.id);
        expect(page.data.some((row) => row.id === property.id)).toBe(true);

        if (mode === "workspace") {
          await ws().workItemTypes.properties.detach(type.id, property.id);
        } else {
          await proj().workItemTypes.properties.detach(type.id, property.id);
        }
        const afterDetach =
          mode === "workspace"
            ? await ws().workItemTypes.properties.list(type.id)
            : await proj().workItemTypes.properties.list(type.id);
        expect(afterDetach.data.some((row) => row.id === property.id)).toBe(false);
      } finally {
        if (mode === "workspace") {
          await ws()
            .workItemProperties.delete(property.id)
            .catch(() => undefined);
        } else {
          await proj()
            .workItemProperties.delete(property.id)
            .catch(() => undefined);
        }
        await deleteAccessibleType(type.id);
      }
    });
  });
});
