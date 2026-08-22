/**
 * list/retrieve/create/update/delete, workspace-scoped; gated on CUSTOM_RELATIONS (402 if disabled), skips cleanly.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { WorkItemRelationDefinitions } from "../../../src/api/v2/WorkItemRelationDefinitions";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("WorkItemRelationDefinitions (v2 live)", () => {
  let resource: WorkItemRelationDefinitions;
  let definitionId: string;
  let featureDisabled = false;

  beforeAll(() => {
    const client = createV2Client(env);
    resource = client.v2.workspace(env.workspaceSlug).workItemRelationDefinitions;
  });

  afterAll(async () => {
    if (!definitionId) return;
    await resource.delete(definitionId).catch(() => undefined);
  });

  it("creates, retrieves, lists, patches, deletes", async () => {
    const label = uniqueName("relDef");
    let created;
    try {
      created = await resource.create({
        name: label,
        inward: `${label}-inward`,
        outward: `${label}-outward`,
      });
    } catch (error) {
      if (error instanceof PlaneApiError && error.status === 402) {
        featureDisabled = true;
        return;
      }
      throw error;
    }
    definitionId = created.id;
    expect(created.is_default).toBe(false);

    const fetched = await resource.retrieve(definitionId);
    expect(fetched.id).toBe(definitionId);

    const page = await resource.list({ per_page: 100 });
    expect(page.data.some((row) => row.id === definitionId)).toBe(true);

    const updated = await resource.update(definitionId, { color: "#123456" });
    expect(updated.color).toBe("#123456");

    await resource.delete(definitionId);
    const idToClear = definitionId;
    definitionId = "";
    await expect(resource.retrieve(idToClear)).rejects.toThrow();
  });

  it("rejects editing a seeded default definition", async () => {
    if (featureDisabled) return;
    const page = await resource.list({ per_page: 100 });
    const seeded = page.data.find((row) => row.is_default);
    if (!seeded) return; // no seeded defaults on this workspace — nothing to assert
    await expect(resource.update(seeded.id, { color: "#000000" })).rejects.toThrow();
  });
});
