import nock from "nock";
import { PlaneClient } from "../../src/client/plane-client";

const BASE = "https://plane.test";
const SLUG = "acme";
const USER_ID = "5d7d9a3e-8f0a-4c55-9b6e-2f1b8c1d0e11";

describe("Workspace.updateMemberRole (offline)", () => {
  const client = new PlaneClient({ baseUrl: BASE, apiKey: "test-key" });

  afterEach(() => nock.cleanAll());

  it("PATCHes the member by user id with the role slug and returns the member", async () => {
    const scope = nock(BASE)
      .patch(`/api/v1/workspaces/${SLUG}/members/${USER_ID}/`, { role_slug: "guest" })
      .reply(200, { id: USER_ID, role: 5, role_slug: "guest" });

    const member = await client.workspace.updateMemberRole(SLUG, USER_ID, "guest");

    expect(member.role_slug).toBe("guest");
    expect(scope.isDone()).toBe(true);
  });
});
