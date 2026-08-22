/**
 * list/retrieve/create/update/delete, workspace-scoped; no disposable project, rows cleaned up in `afterAll`.
 */
import { CustomerProperties } from "../../../src/api/v2/CustomerProperties";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("CustomerProperties (v2 live)", () => {
  let resource: CustomerProperties;
  let propertyId: string;

  beforeAll(() => {
    const client = createV2Client(env);
    resource = client.v2.workspace(env.workspaceSlug).customerProperties;
  });

  afterAll(async () => {
    if (!propertyId) return;
    await resource.delete(propertyId).catch(() => undefined);
  });

  it("creates, retrieves, lists, patches", async () => {
    const created = await resource.create({
      display_name: uniqueName("cp"),
      property_type: "TEXT",
    });
    propertyId = created.id;
    expect(created.property_type).toBe("TEXT");

    const fetched = await resource.retrieve(propertyId);
    expect(fetched.id).toBe(propertyId);

    const page = await resource.list({ per_page: 100 });
    expect(page.data.some((row) => row.id === propertyId)).toBe(true);

    const updated = await resource.update(propertyId, { is_required: true });
    expect(updated.is_required).toBe(true);
  });

  it("deletes", async () => {
    const created = await resource.create({
      display_name: uniqueName("cp-del"),
      property_type: "BOOLEAN",
    });

    await resource.delete(created.id);

    await expect(resource.retrieve(created.id)).rejects.toThrow();
  });
});
