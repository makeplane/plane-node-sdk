import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { CustomerField, Customers } from "../../../src/api/v2/Customers";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeCustomers = () => new Customers(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Customers (v2)", () => {
  it("lists customers", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/customers/")
      .reply(200, {
        data: [{ id: "cust1", name: "Acme Corp", customer_request_count: 3 }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeCustomers().list(SLUG);

    expect(page.data[0].name).toBe("Acme Corp");
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/customers/")
      .query({ fields: "id,name" })
      .reply(200, { data: [{ id: "cust1", name: "Acme Corp" }], pagination: { style: "offset" } });

    // Widened (not literal-tuple) field list — falls back to the full `Customer`
    // return type instead of the narrowed `Pick<...>`; see `states.test.ts`.
    const dynamicFields: CustomerField[] = ["id", "name"];
    const page = await makeCustomers().list(SLUG, { fields: dynamicFields });

    expect(page.data[0].name).toBe("Acme Corp");
    expect(page.data[0].domain).toBeUndefined();
  });

  it("creates, patches, upserts and deletes a customer", async () => {
    nock(BASE).post("/api/v2/workspaces/acme/customers/", { name: "Acme Corp" }).reply(201, {
      id: "cust1",
      name: "Acme Corp",
    });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/customers/cust1/", { stage: "onboarding" })
      .reply(200, { id: "cust1", name: "Acme Corp", stage: "onboarding" });
    nock(BASE)
      .post("/api/v2/workspaces/acme/customers/upsert/", { name: "Acme Corp", external_id: "ext-1" })
      .reply(200, { id: "cust1", name: "Acme Corp", external_id: "ext-1" });
    nock(BASE).delete("/api/v2/workspaces/acme/customers/cust1/").reply(204);

    const customers = makeCustomers();
    const created = await customers.create(SLUG, { name: "Acme Corp" });
    const patched = await customers.update(SLUG, created.id, { stage: "onboarding" });
    expect(patched.stage).toBe("onboarding");

    const upserted = await customers.upsert(SLUG, { name: "Acme Corp", external_id: "ext-1" });
    expect(upserted.external_id).toBe("ext-1");

    await customers.delete(SLUG, created.id);
  });

  it("finds a customer by name", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/customers/")
      .query(true)
      .reply(200, { data: [{ id: "cust1", name: "Acme Corp" }], pagination: { style: "offset" } });

    expect((await makeCustomers().findByName(SLUG, "Acme Corp")).id).toBe("cust1");
  });

  it("links then unlinks work items via workItems.add/remove", async () => {
    const addScope = nock(BASE)
      .post("/api/v2/workspaces/acme/customers/cust1/work-items/", { add: ["wi1"] })
      .reply(200, { added: ["wi1"] });
    const added = await makeCustomers().workItems.add(SLUG, "cust1", ["wi1"]);
    expect(addScope.isDone()).toBe(true);
    expect(added).toEqual(["wi1"]);

    const removeScope = nock(BASE)
      .post("/api/v2/workspaces/acme/customers/cust1/work-items/", { remove: ["wi2"] })
      .reply(200, { removed: ["wi2"] });
    const removed = await makeCustomers().workItems.remove(SLUG, "cust1", ["wi2"]);
    expect(removeScope.isDone()).toBe(true);
    expect(removed).toEqual(["wi2"]);
  });

  it("rejects an unknown field before making the request", async () => {
    await expect(makeCustomers().list(SLUG, { fields: ["nonexistent_field" as never] })).rejects.toThrow(
      /Unknown field\(s\) for customers_list: nonexistent_field/
    );
  });

  describe("requests", () => {
    it("creates, lists, patches and deletes a customer request", async () => {
      nock(BASE)
        .post("/api/v2/workspaces/acme/customers/cust1/requests/", { name: "Needs SSO", work_item_ids: ["wi1"] })
        .reply(201, { id: "req1", customer_id: "cust1", name: "Needs SSO" });
      nock(BASE)
        .get("/api/v2/workspaces/acme/customers/cust1/requests/")
        .reply(200, { data: [{ id: "req1", name: "Needs SSO" }], pagination: { style: "offset" } });
      nock(BASE)
        .patch("/api/v2/workspaces/acme/customers/cust1/requests/req1/", { name: "Needs SAML SSO" })
        .reply(200, { id: "req1", name: "Needs SAML SSO" });
      nock(BASE).delete("/api/v2/workspaces/acme/customers/cust1/requests/req1/").reply(204);

      const requests = makeCustomers().requests;
      const created = await requests.create(SLUG, "cust1", { name: "Needs SSO", work_item_ids: ["wi1"] });
      expect(created.id).toBe("req1");

      const page = await requests.list(SLUG, "cust1");
      expect(page.data).toHaveLength(1);

      const updated = await requests.update(SLUG, "cust1", created.id, { name: "Needs SAML SSO" });
      expect(updated.name).toBe("Needs SAML SSO");

      await requests.delete(SLUG, "cust1", created.id);
    });
  });

  describe("propertyValues", () => {
    it("reads the raw property-id -> values map (not a Page envelope)", async () => {
      nock(BASE)
        .get("/api/v2/workspaces/acme/customers/cust1/property-values/")
        .reply(200, { prop1: ["v1", "v2"], prop2: ["v3"] });

      const values = await makeCustomers().propertyValues.list(SLUG, "cust1");

      expect(values).toEqual({ prop1: ["v1", "v2"], prop2: ["v3"] });
      // Not a Page: no `.data`/`.pagination` envelope on this endpoint.
      expect((values as unknown as { data?: unknown }).data).toBeUndefined();
    });

    it("bulk-sets property values and resolves with no body", async () => {
      const scope = nock(BASE)
        .post("/api/v2/workspaces/acme/customers/cust1/property-values/", { values: { prop1: ["v1"] } })
        .reply(201);

      await expect(
        makeCustomers().propertyValues.create(SLUG, "cust1", { values: { prop1: ["v1"] } })
      ).resolves.toBeUndefined();
      expect(scope.isDone()).toBe(true);
    });
  });
});

describe("navigable customer rows (v2)", () => {
  it("reaches requests, property values and linked work items from a fetched customer", async () => {
    const base = `/api/v2/workspaces/${SLUG}/customers/cust1`;
    nock(BASE).get(`${base}/`).reply(200, { id: "cust1", name: "Acme Co" });
    const requests = nock(BASE)
      .get(`${base}/requests/`)
      .reply(200, { data: [], pagination: { style: "offset" } });
    const values = nock(BASE).get(`${base}/property-values/`).reply(200, {});
    const workItems = nock(BASE)
      .post(`${base}/work-items/`, { add: ["wi1"] })
      .reply(200, { added: ["wi1"] });

    const customer = await makeCustomers().retrieve(SLUG, "cust1");
    await customer.requests.list();
    await customer.propertyValues.list();
    await customer.workItems.add(["wi1"]);

    expect([requests.isDone(), values.isDone(), workItems.isDone()]).toEqual([true, true, true]);
  });
});
