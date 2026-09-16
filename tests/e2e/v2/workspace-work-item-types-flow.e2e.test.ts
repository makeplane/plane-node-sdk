/**
 * End-to-end flow for WORKSPACE-managed work item types (port of plane-ee's
 * `tests/e2e/api_v2/workspace_work_item_types_flow.py`). Enabling workspace mode is irreversible,
 * so it only flips when PLANE_E2E_ENABLE_WORKSPACE_WORK_ITEM_TYPES=1; PLANE_E2E_KEEP=1 keeps the rows.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";
import { resolveWorkItemTypeMode, skipUnlessMode, WorkItemTypeMode } from "./support/work-item-type-mode";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;
const KEEP = process.env.PLANE_E2E_KEEP === "1";
const MAY_ENABLE = process.env.PLANE_E2E_ENABLE_WORKSPACE_WORK_ITEM_TYPES === "1";

const cleanupFailures: string[] = [];
afterEach(() => {
  const failures = cleanupFailures.splice(0);
  expect(failures).toEqual([]);
});

/** Best-effort cleanup step; failures are collected and reported after the test. */
function swallow(promise: Promise<unknown>): Promise<void> {
  return promise.then(
    () => undefined,
    (error: unknown) => {
      cleanupFailures.push(String(error));
    }
  );
}

maybe("v2 workspace work item types flow (live)", () => {
  const suite = useV2Project("ws-wit-flow", env);
  // Flat throughout, like `work-item-types.e2e.test.ts`: this flow crosses the
  // workspace/project seam that governance mode moves, and a bound row would fix the
  // path before the branch that is under test.
  const ws = () => suite.client.v2.workspaces;
  const proj = () => suite.client.v2.workspaces.projects;
  const slug = () => suite.workspaceSlug;
  const project = () => suite.projectId;

  let mode: WorkItemTypeMode;
  beforeAll(async () => {
    mode = await resolveWorkItemTypeMode(suite.client, suite.workspaceSlug);
  });

  it("enables workspace types, scopes a property via a context, imports, writes custom_fields, gates project writes", async () => {
    if (
      !MAY_ENABLE &&
      skipUnlessMode(
        mode,
        "workspace",
        "set PLANE_E2E_ENABLE_WORKSPACE_WORK_ITEM_TYPES=1 to let this flow enable workspace-level types (irreversible)."
      )
    ) {
      return;
    }
    if (mode === "project") {
      // 1. enable -- auto-creates a default workspace type and fans it out to every project
      const feature = await ws().features.update(slug(), { is_work_item_types_enabled: true });
      expect(feature.is_work_item_types_enabled).toBe(true);
    }

    const suffix = uniqueName("").slice(1);
    const createdWorkItems: string[] = [];
    const attached: string[] = [];
    const properties: string[] = [];
    let typeId: string | undefined;

    try {
      // 2. create a workspace-owned type
      const typeName = `WS Type ${suffix}`;
      const wtype = await ws().workItemTypes.create(slug(), { name: typeName });
      typeId = wtype.id;

      // 3. list + retrieve
      expect((await ws().workItemTypes.list(slug())).data.some((row) => row.id === typeId)).toBe(true);
      expect((await ws().workItemTypes.retrieve(slug(), typeId)).id).toBe(typeId);

      // 4-5. workspace TEXT + OPTION properties (option values come from the context below)
      const textProp = await ws().workItemProperties.create(slug(), {
        display_name: `Severity ${suffix}`,
        property_type: "TEXT",
      });
      properties.push(textProp.id);
      const optionProp = await ws().workItemProperties.create(slug(), {
        display_name: `Tier ${suffix}`,
        property_type: "OPTION",
      });
      properties.push(optionProp.id);
      const sevKey = textProp.name!;
      const tierKey = optionProp.name!;

      // 6. scope the OPTION property to this project + type via a context, with its options
      const context = await ws().workItemProperties.contexts.create(slug(), optionProp.id, {
        name: `Bug-only ${suffix}`,
        is_required: false,
        applies_to_all_projects: false,
        applies_to_all_work_item_types: false,
        project_ids: [suite.projectId],
        issue_type_ids: [typeId],
        options: [{ name: "Gold", is_default: true }, { name: "Silver" }],
      });
      const goldId = (context.options ?? []).find((o) => o.name === "Gold")!.id;

      // 7. link both properties to the workspace type
      const result = await ws().workItemTypes.properties.link(slug(), typeId, [textProp.id, optionProp.id]);
      attached.push(textProp.id, optionProp.id);
      expect(result.properties).toEqual(expect.arrayContaining([textProp.id, optionProp.id]));

      // 8. import the workspace type into the project
      await proj().workItemTypes.import(slug(), project(), [typeId]);
      expect((await proj().workItemTypes.list(slug(), project())).data.some((row) => row.id === typeId)).toBe(true);

      // 9-10. create a work item of the imported type with custom_fields, read it back
      const item = await proj().workItems.create(slug(), project(), {
        name: "WS-mode work item",
        type_id: typeId,
        custom_fields: { [sevKey]: "high", [tierKey]: goldId },
      });
      createdWorkItems.push(item.id);
      expect(item.custom_fields![sevKey].value).toBe("high");
      expect((await proj().workItems.retrieve(slug(), project(), item.id)).id).toBe(item.id);

      // 11. project-level type writes are blocked in workspace mode
      await expect(proj().workItemTypes.create(slug(), project(), { name: "nope" })).rejects.toMatchObject<
        Partial<PlaneApiError>
      >({
        status: 409,
        code: "work_item_types_managed_at_workspace",
      });
    } finally {
      if (!KEEP) {
        for (const id of createdWorkItems) await swallow(proj().workItems.delete(slug(), project(), id));
        for (const id of attached) await swallow(ws().workItemTypes.properties.unlink(slug(), typeId ?? "", id));
        for (const id of properties) await swallow(ws().workItemProperties.delete(slug(), id));
        if (typeId) await swallow(ws().workItemTypes.delete(slug(), typeId));
      }
    }
  });
});
