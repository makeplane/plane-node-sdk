/**
 * Both `EffectivePermissions` singletons, read-only; project-level uses a disposable project.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("WorkspacePermissions (v2 live)", () => {
  let client: PlaneClient;

  beforeAll(() => {
    client = createV2Client(env);
  });

  it("gets the caller's effective permissions at the workspace level", async () => {
    const perms = await client.v2.workspaces.permissions.me(env.workspaceSlug);

    expect(Array.isArray(perms.permission_grants)).toBe(true);
  });
});

maybe("ProjectPermissions (v2 live)", () => {
  const suite = useV2Project("perms", env);

  it("gets the caller's effective permissions for a project", async () => {
    const perms = await suite.projectRow.permissions.me();

    expect(Array.isArray(perms.permission_grants)).toBe(true);
  });
});
