/**
 * Read-only, workspace-scoped list+retrieve of seeded system schemes; no project provisioned.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 permission schemes (live)", () => {
  let client: PlaneClient;

  beforeAll(() => {
    client = createV2Client(env);
  });

  it("lists at least the seeded system schemes and retrieves one by id", async () => {
    const schemes = client.v2.workspaces.permissionSchemes;

    const page = await schemes.list(env.workspaceSlug);
    expect(page.data.length).toBeGreaterThan(0);

    const first = page.data[0];
    const fetched = await schemes.retrieve(env.workspaceSlug, first.id);
    expect(fetched.id).toBe(first.id);
  });
});
