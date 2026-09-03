/**
 * Gated by `FeatureFlag.CUSTOMERS` plus the workspace's `is_customer_enabled` toggle; writes 402 without it.
 */
import { Customers } from "../../../src/api/v2/Customers";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 customers (live)", () => {
  const suite = useV2Project("cust", env);
  let customers: Customers;
  let customerId: string;

  beforeAll(async () => {
    customers = suite.client.v2.workspace(suite.workspaceSlug).customers;

    await suite.client.v2.transport.request("PATCH", `/workspaces/${suite.workspaceSlug}/features/`, {
      data: { is_customer_enabled: true },
    });

    const created = await customers.create({ name: uniqueName("e2e-customer") });
    customerId = created.id;
  });

  afterAll(async () => {
    if (!customerId) return;
    await customers.delete(customerId).catch(() => undefined);
  });

  it("retrieves and patches the customer", async () => {
    const fetched = await customers.retrieve(customerId);
    expect(fetched.id).toBe(customerId);

    const updated = await customers.update(customerId, { stage: "trial" });
    expect(updated.stage).toBe("trial");
  });

  it("upserts on (external_source, external_id)", async () => {
    const externalId = uniqueName("ext");
    const created = await customers.upsert({
      name: uniqueName("e2e-upsert-customer"),
      external_source: "e2e-suite",
      external_id: externalId,
    });

    const reconciled = await customers.upsert({
      name: "Renamed by upsert",
      external_source: "e2e-suite",
      external_id: externalId,
    });

    expect(reconciled.id).toBe(created.id);
    expect(reconciled.name).toBe("Renamed by upsert");

    await customers.delete(created.id);
  });

  describe("requests", () => {
    it("creates, lists, updates and deletes a request", async () => {
      const created = await customers.requests.create(customerId, {
        name: uniqueName("e2e-request"),
      });
      expect(created.customer_id).toBe(customerId);

      const page = await customers.requests.list(customerId);
      expect(page.data.some((r) => r.id === created.id)).toBe(true);

      const updated = await customers.requests.update(customerId, created.id, {
        description_html: "<p>details</p>",
      });
      expect(updated.description_html).toBe("<p>details</p>");

      await customers.requests.delete(customerId, created.id);
    });
  });

  describe("propertyValues", () => {
    it("reads an empty map for a customer with no stored values", async () => {
      const values = await customers.propertyValues.list(customerId);
      expect(values).toEqual({});
    });
  });

  describe("linked work items", () => {
    it("adds then removes a work item link", async () => {
      const workItems = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId).workItems;
      const workItem = await workItems.create({
        name: uniqueName("cust-linked-wi"),
      });

      const added = await customers.workItems.add(customerId, [workItem.id]);
      expect(added).toContain(workItem.id);

      const removed = await customers.workItems.remove(customerId, [workItem.id]);
      expect(removed).toContain(workItem.id);

      await workItems.delete(workItem.id).catch(() => undefined);
    });
  });

  it("rejects an unknown fields value", async () => {
    await expect(customers.list({ fields: ["nope" as never] })).rejects.toThrow(/Unknown field/);
  });
});
