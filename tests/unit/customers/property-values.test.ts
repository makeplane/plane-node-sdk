import { PlaneClient } from "../../../src/client/plane-client";
import { Customer } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.customerId), "Customer Property Values (bulk) API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let customerId: string;
  let propertyId: string;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    customerId = config.customerId;

    const propertyName = randomizeName("bulk_text_prop_");
    const property = await client.customers.properties.createPropertyDefinition(workspaceSlug, {
      name: propertyName,
      display_name: propertyName,
      property_type: "TEXT",
    });
    propertyId = property.id!;
  });

  afterAll(async () => {
    if (propertyId) {
      try {
        await client.customers.properties.deletePropertyDefinition(workspaceSlug, propertyId);
      } catch (error) {
        console.warn("Failed to delete customer property:", error);
      }
    }
  });

  it("should bulk-set customer property values", async () => {
    await expect(
      client.customers.properties.createValues(workspaceSlug, customerId, {
        customer_property_values: {
          [propertyId]: ["bulk value"],
        },
      })
    ).resolves.toBeUndefined();
  });

  it("should read back the bulk-set value", async () => {
    const values = await client.customers.properties.listValues(workspaceSlug, customerId);
    expect(values).toBeDefined();
  });
});

describe(!!config.workspaceSlug, "Customer Delete By External Reference API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let customer: Customer;
  const externalSource = "node-sdk-test";
  const externalId = randomizeName("ext-");

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    // Safety net if delete-by-external-reference failed
    if (customer?.id) {
      try {
        await client.customers.delete(workspaceSlug, customer.id);
      } catch {
        // already deleted — expected
      }
    }
  });

  it("should delete a customer by external reference", async () => {
    customer = await client.customers.create(workspaceSlug, {
      name: randomizeName("External Customer "),
      external_source: externalSource,
      external_id: externalId,
    });
    expect(customer.id).toBeDefined();

    await expect(
      client.customers.deleteByExternalId(workspaceSlug, externalSource, externalId)
    ).resolves.toBeUndefined();

    await expect(client.customers.retrieve(workspaceSlug, customer.id!)).rejects.toThrow();
    customer = undefined as unknown as Customer;
  });

  it("should succeed silently when the external reference matches nothing", async () => {
    await expect(
      client.customers.deleteByExternalId(workspaceSlug, externalSource, "does-not-exist")
    ).resolves.toBeUndefined();
  });
});
