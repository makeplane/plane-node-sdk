import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Teamspaces } from "../../../src/api/v2/Teamspaces";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeResource = () => new Teamspaces(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Teamspaces (v2)", () => {
  it("lists teamspaces with a valid expand", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/teamspaces/")
      .query({ expand: "lead" })
      .reply(200, {
        data: [{ id: "1", name: "Platform", lead_id: "u1" }],
        pagination: { style: "offset" },
      });

    const page = await makeResource().list(SLUG, { expand: ["lead"] });

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].name).toBe("Platform");
  });

  it("rejects an unknown expand value before making the request", async () => {
    // Proof this can actually fail: "members" reads like a plausible expand target
    // but the golden's only one for this operation is "lead".
    await expect(makeResource().list(SLUG, { expand: ["members"] as never })).rejects.toThrow(
      /Unknown expand value\(s\) for teamspaces_list: members/
    );
  });

  it("creates then patches", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/teamspaces/", { name: "Platform" })
      .reply(201, { id: "1", name: "Platform" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/teamspaces/1/", { lead_id: "u1" })
      .reply(200, { id: "1", name: "Platform", lead_id: "u1" });

    const resource = makeResource();
    const created = await resource.create(SLUG, { name: "Platform" });
    const updated = await resource.update(SLUG, created.id, { lead_id: "u1" });

    expect(updated.lead_id).toBe("u1");
  });

  it("retrieves and deletes", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/teamspaces/1/").reply(200, { id: "1", name: "Platform" });
    const deleteScope = nock(BASE).delete("/api/v2/workspaces/acme/teamspaces/1/").reply(204);

    const fetched = await makeResource().retrieve(SLUG, "1");
    expect(fetched.name).toBe("Platform");

    await expect(makeResource().delete(SLUG, "1")).resolves.toBeUndefined();
    expect(deleteScope.isDone()).toBe(true);
  });

  it("finds by name", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/teamspaces/")
      .query({ name: "Platform", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "1", name: "Platform" }], pagination: { style: "offset" } });

    expect((await makeResource().findByName(SLUG, "Platform")).id).toBe("1");
    expect(scope.isDone()).toBe(true);
  });
});
