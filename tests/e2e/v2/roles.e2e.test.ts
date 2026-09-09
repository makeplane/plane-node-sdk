/**
 * list / retrieve against a real server. Read-only, nothing to clean up.
 *
 * Drives both ways in: the flat form passes the slug per call, the navigated form takes
 * it off a fetched workspace row. They must agree — the navigated view prepends the ids
 * positionally, and nothing but a live call proves it prepended them into the right
 * parameters of the right resource.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { LoadedWorkspace } from "../../../src/api/v2/loaded/Workspace";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Roles (v2 live)", () => {
  let client: PlaneClient;
  let workspace: LoadedWorkspace;

  beforeAll(async () => {
    client = createV2Client(env);
    workspace = await client.v2.workspaces.retrieve(env.workspaceSlug);
  });

  it("lists and retrieves a role (flat)", async () => {
    const page = await client.v2.workspaces.roles.list(env.workspaceSlug, { per_page: 100 });
    expect(page.data.length).toBeGreaterThan(0);

    const [first] = page.data;
    const fetched = await client.v2.workspaces.roles.retrieve(env.workspaceSlug, first.id);
    expect(fetched.id).toBe(first.id);

    const bySlug = await client.v2.workspaces.roles.findBySlug(env.workspaceSlug, fetched.slug!, {
      namespace: fetched.namespace,
    });
    expect(bySlug.id).toBe(fetched.id);
  });

  it("reaches the same roles off a fetched workspace row (navigated)", async () => {
    const flat = await client.v2.workspaces.roles.list(env.workspaceSlug, { per_page: 100 });
    const navigated = await workspace.roles.list({ per_page: 100 });

    expect(new Set(navigated.data.map((role) => role.id))).toEqual(new Set(flat.data.map((role) => role.id)));

    const [first] = navigated.data;
    const fetched = await workspace.roles.retrieve(first.id);
    expect(fetched.id).toBe(first.id);
  });
});
