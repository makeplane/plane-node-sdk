import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { CustomerProperties, CustomerPropertyField } from "../../../src/api/v2/CustomerProperties";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeResource = () =>
  new CustomerProperties(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("CustomerProperties (v2)", () => {
  it("lists customer properties", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/customer-properties/")
      .reply(200, {
        data: [{ id: "1", display_name: "Plan tier", property_type: "OPTION" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeResource().list(SLUG);

    expect(page.data[0].property_type).toBe("OPTION");
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/customer-properties/")
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    // Dynamic field list is typed as the widened `CustomerPropertyField[]`, so it
    // falls back to the full `CustomerProperty` return type (see states.test.ts).
    const dynamicFields: CustomerPropertyField[] = ["id"];
    const page = await makeResource().list(SLUG, { fields: dynamicFields });

    expect(page.data[0].id).toBe("1");
    expect(page.data[0].display_name).toBeUndefined();
  });

  it("creates then patches", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/customer-properties/", { display_name: "Plan tier", property_type: "OPTION" })
      .reply(201, { id: "1", display_name: "Plan tier", property_type: "OPTION" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/customer-properties/1/", { is_active: false })
      .reply(200, { id: "1", display_name: "Plan tier", is_active: false });

    const resource = makeResource();
    const created = await resource.create(SLUG, { display_name: "Plan tier", property_type: "OPTION" });
    const updated = await resource.update(SLUG, created.id, { is_active: false });

    expect(updated.is_active).toBe(false);
  });

  it("retrieves and deletes", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/customer-properties/1/").reply(200, { id: "1", display_name: "Plan tier" });
    const deleteScope = nock(BASE).delete("/api/v2/workspaces/acme/customer-properties/1/").reply(204);

    const fetched = await makeResource().retrieve(SLUG, "1");
    expect(fetched.display_name).toBe("Plan tier");

    await expect(makeResource().delete(SLUG, "1")).resolves.toBeUndefined();
    expect(deleteScope.isDone()).toBe(true);
  });

  it("finds by name", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/customer-properties/")
      .query({ name: "Plan tier", per_page: "2", count: "false" })
      .reply(200, {
        data: [{ id: "1", display_name: "Plan tier", name: "Plan tier" }],
        pagination: { style: "offset" },
      });

    expect((await makeResource().findByName(SLUG, "Plan tier")).id).toBe("1");
    expect(scope.isDone()).toBe(true);
  });

  it("passes through a valid order_by", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/customer-properties/")
      .query({ order_by: "-sort_order" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeResource().list(SLUG, { order_by: "-sort_order" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    // Proof this can actually fail: "name" is a valid `fields` value for this operation
    // but not a listed `order_by` value (verified against generated/constants.ts's
    // ORDER_BY["customer_properties_list"]).
    await expect(makeResource().list(SLUG, { order_by: "name" as never })).rejects.toThrow(
      /Unknown order_by 'name' for customer_properties_list/
    );
  });
});
