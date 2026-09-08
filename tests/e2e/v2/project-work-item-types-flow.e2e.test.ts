/**
 * End-to-end flow for PROJECT-managed work item types (port of plane-ee's
 * `tests/e2e/api_v2/project_work_item_types_flow.py`). Set PLANE_E2E_KEEP=1 to keep the rows.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";
import { resolveWorkItemTypeMode, skipUnlessMode, WorkItemTypeMode } from "./support/work-item-type-mode";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;
const KEEP = process.env.PLANE_E2E_KEEP === "1";

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

maybe("v2 project work item types flow (live)", () => {
  const suite = useV2Project("wit-flow", env);
  // Flat throughout, like `work-item-types.e2e.test.ts`: this flow crosses the
  // workspace/project seam that governance mode moves, and a bound row would fix the
  // path before the branch that is under test.
  const proj = () => suite.client.v2.projects;
  const slug = () => suite.workspaceSlug;
  const project = () => suite.projectId;

  let mode: WorkItemTypeMode;
  beforeAll(async () => {
    mode = await resolveWorkItemTypeMode(suite.client, suite.workspaceSlug);
  });

  it("enables, creates a type + properties, links them, writes custom_fields, marks default", async () => {
    if (skipUnlessMode(mode, "project", "this flow needs project-managed work item types")) return;

    const suffix = uniqueName("").slice(1);
    const createdWorkItems: string[] = [];
    const attached: string[] = [];
    const properties: string[] = [];
    let typeId: string | undefined;

    try {
      // 1. enable -- bootstraps the project's default (non-epic) type
      const enabled = await proj().workItemTypes.enable(slug(), project());
      expect(enabled.is_epic).toBe(false);

      // 2. create a project-owned type
      const typeName = `E2E Type ${suffix}`;
      const wtype = await proj().workItemTypes.create(slug(), project(), { name: typeName });
      typeId = wtype.id;
      expect(wtype.name).toBe(typeName);
      expect(wtype.is_epic).toBe(false);

      // 3. list + retrieve + schema
      expect((await proj().workItemTypes.list(slug(), project())).data.some((row) => row.id === typeId)).toBe(true);
      expect((await proj().workItemTypes.retrieve(slug(), project(), typeId)).id).toBe(typeId);
      const schema = await proj().workItemTypes.schema(slug(), project(), typeId);
      expect(schema.fields).toBeDefined();
      expect(schema.custom_fields).toBeDefined();

      // 4. TEXT property
      const textProp = await proj().workItemProperties.create(slug(), project(), {
        display_name: `Severity ${suffix}`,
        property_type: "TEXT",
      });
      properties.push(textProp.id);
      const sevKey = textProp.name!; // slugified display_name; the custom_fields key

      // 5. OPTION property with inline options
      const optionProp = await proj().workItemProperties.create(slug(), project(), {
        display_name: `Tier ${suffix}`,
        property_type: "OPTION",
        options: [{ name: "Gold", is_default: true }, { name: "Silver" }],
      });
      properties.push(optionProp.id);
      const tierKey = optionProp.name!;
      expect(new Set((optionProp.options ?? []).map((o) => o.name))).toEqual(new Set(["Gold", "Silver"]));
      const goldId = (optionProp.options ?? []).find((o) => o.name === "Gold")!.id;

      // 6. add one more option through the options endpoint
      await proj().workItemProperties.options.create(slug(), project(), optionProp.id, { name: "Bronze" });
      const names = (await proj().workItemProperties.options.list(slug(), project(), optionProp.id)).data.map(
        (o) => o.name
      );
      expect(new Set(names)).toEqual(new Set(["Gold", "Silver", "Bronze"]));

      // 7. a second default option is rejected
      await expect(
        proj().workItemProperties.options.create(slug(), project(), optionProp.id, {
          name: "Platinum",
          is_default: true,
        })
      ).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 400 });

      // 8. link both properties to the type
      const result = await proj().workItemTypes.properties.link(slug(), project(), typeId, [
        textProp.id,
        optionProp.id,
      ]);
      attached.push(textProp.id, optionProp.id);
      expect(result.properties).toEqual(expect.arrayContaining([textProp.id, optionProp.id]));
      const listed = (await proj().workItemTypes.properties.list(slug(), project(), typeId)).data.map((p) => p.id);
      expect(listed).toEqual(expect.arrayContaining([textProp.id, optionProp.id]));

      // 9. create a work item of this type with custom_fields, read it back
      const item = await proj().workItems.create(slug(), project(), {
        name: "E2E work item",
        type_id: typeId,
        custom_fields: { [sevKey]: "high", [tierKey]: goldId },
      });
      createdWorkItems.push(item.id);
      expect(item.custom_fields![sevKey].value).toBe("high");
      expect((item.custom_fields![tierKey].value_detail as { name?: string }).name).toBe("Gold");

      const fetched = await proj().workItems.retrieve(slug(), project(), item.id);
      expect(fetched.custom_fields![sevKey].value).toBe("high");

      // 10. the readable `type` name resolves to the same type
      const item2 = await proj().workItems.create(slug(), project(), { name: "E2E by type name", type: typeName });
      createdWorkItems.push(item2.id);
      expect(item2.type_id).toBe(typeId);

      // 11. mark-default
      expect((await proj().workItemTypes.markDefault(slug(), project(), typeId)).is_default).toBe(true);
    } finally {
      if (!KEEP) {
        for (const id of createdWorkItems) await swallow(proj().workItems.delete(slug(), project(), id));
        for (const id of attached)
          await swallow(proj().workItemTypes.properties.unlink(slug(), project(), typeId ?? "", id));
        for (const id of properties) await swallow(proj().workItemProperties.delete(slug(), project(), id));
      }
    }

    if (!KEEP && typeId) {
      // the type is now the project default, so delete is refused
      await expect(proj().workItemTypes.delete(slug(), project(), typeId)).rejects.toMatchObject<
        Partial<PlaneApiError>
      >({
        status: 409,
      });
    }
  });
});
