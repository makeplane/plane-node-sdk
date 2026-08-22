import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Labels } from "../../../src/api/v2/Labels";
import { LabelField } from "../../../src/api/v2/generated/constants";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeLabels = () =>
  new Labels(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("Labels (v2)", () => {
  it("lists labels", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/labels/")
      .reply(200, {
        data: [{ id: "1", name: "Bug", color: "#fff" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeLabels().list();

    expect(page.data[0].name).toBe("Bug");
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/labels/")
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    // Dynamic field list is typed as the widened `LabelField[]`, so it falls back
    // to the full `Label` return type.
    const dynamicFields: LabelField[] = ["id"];
    const page = await makeLabels().list({ fields: dynamicFields });

    expect(page.data[0].id).toBe("1");
    expect(page.data[0].name).toBeUndefined();
  });

  it("creates then patches", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/labels/", { name: "Bug" })
      .reply(201, { id: "1", name: "Bug" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/labels/1/", { name: "Bugfix" })
      .reply(200, { id: "1", name: "Bugfix" });

    const labels = makeLabels();
    const created = await labels.create({ name: "Bug" });
    const updated = await labels.update(created.id, { name: "Bugfix" });

    expect(updated.name).toBe("Bugfix");
  });

  it("finds by name", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/labels/")
      .query(true)
      .reply(200, { data: [{ id: "1", name: "Bug" }], pagination: { style: "offset" } });

    expect((await makeLabels().findByName("Bug")).id).toBe("1");
  });

  it("passes through a valid order_by", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/labels/")
      .query({ order_by: "-created_at" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeLabels().list({ order_by: "-created_at" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeLabels().list({ order_by: "nope" as never })).rejects.toThrow(
      /Unknown order_by 'nope' for labels_list/
    );
  });

  it("throws a clear error when constructed with no scope", async () => {
    const labels = new Labels(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

    await expect(labels.list()).rejects.toThrow(/Missing path parameter 'slug'/);
  });
});
