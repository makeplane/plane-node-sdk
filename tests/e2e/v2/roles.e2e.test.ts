/** list / retrieve against a real server. Read-only, nothing to clean up. */
import { Roles } from "../../../src/api/v2/Roles";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Roles (v2 live)", () => {
  let resource: Roles;

  beforeAll(() => {
    const client = createV2Client(env);
    resource = client.v2.workspace(env.workspaceSlug).roles;
  });

  it("lists and retrieves a role", async () => {
    const page = await resource.list({ per_page: 100 });
    expect(page.data.length).toBeGreaterThan(0);

    const [first] = page.data;
    const fetched = await resource.retrieve(first.id);
    expect(fetched.id).toBe(first.id);

    const bySlug = await resource.findBySlug(fetched.slug!, { namespace: fetched.namespace });
    expect(bySlug.id).toBe(fetched.id);
  });
});
