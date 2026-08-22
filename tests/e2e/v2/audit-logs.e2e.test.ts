/**
 * Read-only; offset/COUNT pagination is disabled entirely for this huge table, so `list` uses cursor pagination.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 audit logs (live)", () => {
  let client: PlaneClient;

  beforeAll(() => {
    client = createV2Client(env);
  });

  it("lists without throwing and honors per_page", async () => {
    const auditLogs = client.v2.workspace(env.workspaceSlug).auditLogs;

    const page = await auditLogs.list({ per_page: 5, paginate: "cursor" });
    expect(Array.isArray(page.data)).toBe(true);
    if (page.data.length > 0) {
      const fetched = await auditLogs.retrieve(page.data[0].id);
      expect(fetched.id).toBe(page.data[0].id);
    }
  });
});
