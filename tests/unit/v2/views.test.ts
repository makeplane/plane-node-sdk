import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { ProjectViews } from "../../../src/api/v2/Views";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const makeViews = () =>
  new ProjectViews(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("ProjectViews (v2) — project-scoped", () => {
  it("lists project views", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/views/")
      .reply(200, { data: [{ id: "1", name: "My Sprint" }], pagination: { style: "offset" } });

    const page = await makeViews().list();

    expect(page.data[0].name).toBe("My Sprint");
  });

  it("creates then patches, then deletes a view", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/views/", { name: "My Sprint" })
      .reply(201, { id: "1", name: "My Sprint" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/views/1/", { is_locked: true })
      .reply(200, { id: "1", name: "My Sprint", is_locked: true });
    nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/views/1/").reply(204);

    const views = makeViews();
    const created = await views.create({ name: "My Sprint" });
    const updated = await views.update(created.id, { is_locked: true });
    expect(updated.is_locked).toBe(true);

    await views.delete("1");
  });

  it("rejects an unknown fields value before making the request", async () => {
    await expect(makeViews().list({ fields: ["nope" as never] })).rejects.toThrow(
      /Unknown field\(s\) for project_views_list/
    );
  });
});
