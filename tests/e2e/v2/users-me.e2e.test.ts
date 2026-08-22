/**
 * `users.me`: read-only, entirely unscoped singleton describing the calling principal.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 users.me (live)", () => {
  let client: PlaneClient;

  beforeAll(() => {
    client = createV2Client(env);
  });

  it("retrieves the calling principal — no workspace scoping", async () => {
    const users = client.v2.users;

    const me = await users.me();

    expect(typeof me.id).toBe("string");
    expect(typeof me.email).toBe("string");
    expect(["oauth", "api_key", "other"]).toContain(me.principal_kind);
    expect(Array.isArray(me.scopes)).toBe(true);
  });
});
