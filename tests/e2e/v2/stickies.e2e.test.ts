/**
 * list/retrieve/create/update/delete, workspace-scoped and personal to the caller (`owner_id`).
 */
import { Stickies } from "../../../src/api/v2/Stickies";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Stickies (v2 live)", () => {
  let resource: Stickies;
  let stickyId: string;

  beforeAll(() => {
    const client = createV2Client(env);
    resource = client.v2.workspace(env.workspaceSlug).stickies;
  });

  afterAll(async () => {
    if (!stickyId) return;
    await resource.delete(stickyId).catch(() => undefined);
  });

  it("creates, retrieves, lists, patches, deletes", async () => {
    const created = await resource.create({ name: uniqueName("sticky") });
    stickyId = created.id;

    const fetched = await resource.retrieve(stickyId);
    expect(fetched.id).toBe(stickyId);

    const page = await resource.list({ per_page: 100 });
    expect(page.data.some((row) => row.id === stickyId)).toBe(true);

    const updated = await resource.update(stickyId, { color: "#ff00ff" });
    expect(updated.color).toBe("#ff00ff");

    await resource.delete(stickyId);
    const idToClear = stickyId;
    stickyId = "";
    await expect(resource.retrieve(idToClear)).rejects.toThrow();
  });
});
