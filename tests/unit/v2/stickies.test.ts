import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Stickies } from "../../../src/api/v2/Stickies";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeResource = () =>
  new Stickies(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), { slug: SLUG });

afterEach(() => nock.cleanAll());

describe("Stickies (v2)", () => {
  it("lists stickies, optionally filtered by owner", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/stickies/")
      .query({ owner_id: "u1" })
      .reply(200, { data: [{ id: "1", name: "Remember this" }], pagination: { style: "offset" } });

    const page = await makeResource().list({ owner_id: "u1" });

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].name).toBe("Remember this");
  });

  it("creates a blank sticky with an empty body", async () => {
    nock(BASE).post("/api/v2/workspaces/acme/stickies/", {}).reply(201, { id: "1" });

    const created = await makeResource().create({});

    expect(created.id).toBe("1");
  });

  it("creates then patches", async () => {
    nock(BASE).post("/api/v2/workspaces/acme/stickies/", { name: "Note" }).reply(201, { id: "1", name: "Note" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/stickies/1/", { color: "#f00" })
      .reply(200, { id: "1", name: "Note", color: "#f00" });

    const resource = makeResource();
    const created = await resource.create({ name: "Note" });
    const updated = await resource.update(created.id, { color: "#f00" });

    expect(updated.color).toBe("#f00");
  });

  it("retrieves and deletes", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/stickies/1/").reply(200, { id: "1", name: "Note" });
    const deleteScope = nock(BASE).delete("/api/v2/workspaces/acme/stickies/1/").reply(204);

    const fetched = await makeResource().retrieve("1");
    expect(fetched.name).toBe("Note");

    await expect(makeResource().delete("1")).resolves.toBeUndefined();
    expect(deleteScope.isDone()).toBe(true);
  });

  it("rejects an unknown field before making the request", async () => {
    // Proof this can actually fail: "priority" isn't a Sticky field at all.
    await expect(makeResource().list({ fields: ["priority"] as never })).rejects.toThrow(
      /Unknown field\(s\) for stickies_list: priority/
    );
  });
});
