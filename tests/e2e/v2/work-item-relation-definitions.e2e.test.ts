/**
 * list/retrieve/create/update/delete, workspace-scoped; gated on CUSTOM_RELATIONS — a 402
 * there is an announced sit-out (see `support/capability.ts`), never a silent pass.
 */
import { WorkItemRelationDefinitions } from "../../../src/api/v2/WorkItemRelationDefinitions";
import { useCapability } from "./support/capability";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("WorkItemRelationDefinitions (v2 live)", () => {
  // Flat: every call names the slug it addresses.
  let resource: WorkItemRelationDefinitions;
  const slug = env.workspaceSlug;
  let definitionId: string;
  const capability = useCapability("FeatureFlag.CUSTOM_RELATIONS is not enabled for this workspace");

  beforeAll(() => {
    const client = createV2Client(env);
    resource = client.v2.workspaces.workItemRelationDefinitions;
  });

  afterAll(async () => {
    if (!definitionId) return;
    await resource.delete(slug, definitionId).catch(() => undefined);
  });

  capability.it("creates, retrieves, lists, patches, deletes", async () => {
    const label = uniqueName("relDef");
    const created = await resource.create(slug, {
      name: label,
      inward: `${label}-inward`,
      outward: `${label}-outward`,
    });
    definitionId = created.id;
    expect(created.is_default).toBe(false);

    const fetched = await resource.retrieve(slug, definitionId);
    expect(fetched.id).toBe(definitionId);

    const page = await resource.list(slug, { per_page: 100 });
    expect(page.data.some((row) => row.id === definitionId)).toBe(true);

    const updated = await resource.update(slug, definitionId, { color: "#123456" });
    expect(updated.color).toBe("#123456");

    await resource.delete(slug, definitionId);
    const idToClear = definitionId;
    definitionId = "";
    await expect(resource.retrieve(slug, idToClear)).rejects.toThrow();
  });

  capability.it("rejects editing a seeded default definition", async () => {
    const page = await resource.list(slug, { per_page: 100 });
    const seeded = page.data.find((row) => row.is_default);
    if (!seeded) return; // no seeded defaults on this workspace — nothing to assert
    await expect(resource.update(slug, seeded.id, { color: "#000000" })).rejects.toThrow();
  });
});
