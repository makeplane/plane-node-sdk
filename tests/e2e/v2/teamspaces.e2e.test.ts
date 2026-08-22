/**
 * list/retrieve/create/update/delete against a real server, workspace-scoped.
 */
import { Teamspaces } from "../../../src/api/v2/Teamspaces";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Teamspaces (v2 live)", () => {
  let resource: Teamspaces;
  let teamspaceId: string;

  beforeAll(() => {
    const client = createV2Client(env);
    resource = client.v2.workspace(env.workspaceSlug).teamspaces;
  });

  afterAll(async () => {
    if (!teamspaceId) return;
    await resource.delete(teamspaceId).catch(() => undefined);
  });

  it("creates, retrieves, lists, patches, deletes", async () => {
    const created = await resource.create({ name: uniqueName("teamspace") });
    teamspaceId = created.id;

    const fetched = await resource.retrieve(teamspaceId);
    expect(fetched.id).toBe(teamspaceId);

    const page = await resource.list({ per_page: 100 });
    expect(page.data.some((row) => row.id === teamspaceId)).toBe(true);

    const updated = await resource.update(teamspaceId, {
      description_html: "<p>updated</p>",
    });
    expect(updated.description_html).toBe("<p>updated</p>");

    await resource.delete(teamspaceId);
    const idToClear = teamspaceId;
    teamspaceId = "";
    await expect(resource.retrieve(idToClear)).rejects.toThrow();
  });
});
