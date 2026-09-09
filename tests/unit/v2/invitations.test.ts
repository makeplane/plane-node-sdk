import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Invitations } from "../../../src/api/v2/Invitations";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeResource = () => new Invitations(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Invitations (v2)", () => {
  it("lists invitations", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/invitations/")
      .reply(200, {
        data: [{ id: "1", email: "a@example.com", accepted: false }],
        pagination: { style: "offset" },
      });

    const page = await makeResource().list("acme");

    expect(page.data[0].email).toBe("a@example.com");
  });

  it("creates a single invite", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/invitations/", { email: "a@example.com" })
      .reply(201, { id: "1", email: "a@example.com", role: "member" });

    const created = await makeResource().create("acme", { email: "a@example.com" });

    expect(created.role).toBe("member");
  });

  it("retrieves and deletes", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/invitations/1/").reply(200, { id: "1", email: "a@example.com" });
    const deleteScope = nock(BASE).delete("/api/v2/workspaces/acme/invitations/1/").reply(204);

    const fetched = await makeResource().retrieve("acme", "1");
    expect(fetched.id).toBe("1");

    await expect(makeResource().delete("acme", "1")).resolves.toBeUndefined();
    expect(deleteScope.isDone()).toBe(true);
  });

  it("has no update method — invites are accepted/declined, not edited", () => {
    const invitations = makeResource() as unknown as Record<string, unknown>;
    expect(invitations.update).toBeUndefined();
  });

  it("bulk posts to the bulk sub-path and returns the array the live endpoint actually sends", async () => {
    const body = { emails: ["a@example.com", "b@example.com"], role: "member" };
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/invitations/bulk/", body)
      .reply(201, [
        { id: "1", email: "a@example.com" },
        { id: "2", email: "b@example.com" },
      ]);

    const created = await makeResource().bulk("acme", body);

    expect(scope.isDone()).toBe(true);
    expect(created).toHaveLength(2);
    expect(created[1].email).toBe("b@example.com");
  });

  it("bulk validates fields against members_bulk's own FIELDS entry", async () => {
    // Proof this can actually fail: "display_name" is not one of members_bulk's
    // allowed fields (that enum only covers WorkspaceInvite's own columns).
    await expect(
      makeResource().bulk("acme", { emails: ["a@example.com"] }, { fields: ["display_name"] as never })
    ).rejects.toThrow(/Unknown field\(s\) for members_bulk/);
  });
});
