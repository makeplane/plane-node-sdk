/**
 * Gated by `FeatureFlag.CUSTOMERS` plus the workspace's `is_customer_enabled` toggle; writes 402 without it.
 *
 * The customer's own routes are driven flat (`customers` takes the slug per call); its
 * requests, property values and linked work items are driven off the fetched customer
 * row, because each of those is a grandchild whose URL carries the customer's id.
 */
import { Customers } from "../../../src/api/v2/Customers";
import { LoadedCustomer } from "../../../src/api/v2/loaded/Customer";
import { useCapability } from "./support/capability";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 customers (live)", () => {
  const suite = useV2Project("cust", env);
  let customers: Customers;
  const slug = () => suite.workspaceSlug;
  let customer: LoadedCustomer;
  // The workspace toggle below and every customer route behind it are EE-gated; an
  // unlicensed workspace answers 402 to the whole family.
  const capability = useCapability("FeatureFlag.CUSTOMERS is not enabled for this workspace");

  capability.beforeAll(async () => {
    customers = suite.client.v2.workspaces.customers;

    await suite.client.v2.workspaces.features.update(suite.workspaceSlug, { is_customer_enabled: true });

    customer = await customers.create(slug(), { name: uniqueName("e2e-customer") });
  });

  afterAll(async () => {
    if (!customer) return;
    await customers.delete(slug(), customer.id).catch(() => undefined);
  });

  capability.it("retrieves and patches the customer", async () => {
    const fetched = await customers.retrieve(slug(), customer.id);
    expect(fetched.id).toBe(customer.id);

    const updated = await customers.update(slug(), customer.id, { stage: "trial" });
    expect(updated.stage).toBe("trial");
  });

  capability.it("upserts on (external_source, external_id)", async () => {
    const externalId = uniqueName("ext");
    const created = await customers.upsert(slug(), {
      name: uniqueName("e2e-upsert-customer"),
      external_source: "e2e-suite",
      external_id: externalId,
    });

    const reconciled = await customers.upsert(slug(), {
      name: "Renamed by upsert",
      external_source: "e2e-suite",
      external_id: externalId,
    });

    expect(reconciled.id).toBe(created.id);
    expect(reconciled.name).toBe("Renamed by upsert");

    await customers.delete(slug(), created.id);
  });

  describe("requests", () => {
    capability.it("creates, lists, updates and deletes a request", async () => {
      const created = await customer.requests.create({
        name: uniqueName("e2e-request"),
      });
      expect(created.customer_id).toBe(customer.id);

      const page = await customer.requests.list();
      expect(page.data.some((r) => r.id === created.id)).toBe(true);

      const updated = await customer.requests.update(created.id, {
        description_html: "<p>details</p>",
      });
      expect(updated.description_html).toBe("<p>details</p>");

      await customer.requests.delete(created.id);
    });
  });

  describe("propertyValues", () => {
    capability.it("reads an empty map for a customer with no stored values", async () => {
      const values = await customer.propertyValues.list();
      expect(values).toEqual({});
    });
  });

  describe("linked work items", () => {
    capability.it("adds then removes a work item link", async () => {
      const workItems = suite.projectRow.workItems;
      const workItem = await workItems.create({
        name: uniqueName("cust-linked-wi"),
      });

      const added = await customer.workItems.add([workItem.id]);
      expect(added).toContain(workItem.id);

      const removed = await customer.workItems.remove([workItem.id]);
      expect(removed).toContain(workItem.id);

      await workItems.delete(workItem.id).catch(() => undefined);
    });
  });

  // Not gated: `fields` is validated client-side and never reaches the network, so this
  // one still has something to prove on a workspace that cannot host a customer at all.
  it("rejects an unknown fields value", async () => {
    await expect(customers.list(slug(), { fields: ["nope" as never] })).rejects.toThrow(/Unknown field/);
  });
});
