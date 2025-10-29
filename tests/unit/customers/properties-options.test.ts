import { PlaneClient } from "../../../src/client/plane-client";
import { CustomerProperty } from "../../../src/models/Customer";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.customerId), "Customer Properties API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let customerId: string;
  let customerProperty: CustomerProperty;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    customerId = config.customerId;
  });

  afterAll(async () => {
    // Clean up created customer property
    if (customerProperty?.id) {
      try {
        await client.customers.properties.deletePropertyDefinition(workspaceSlug, customerProperty.id);
      } catch (error) {
        console.warn("Failed to delete customer property:", error);
      }
    }
  });

  it("should create a customer property", async () => {
    const name = randomizeName("test-customer-property");
    customerProperty = await client.customers.properties.createPropertyDefinition(workspaceSlug, {
      name: name,
      display_name: name,
      description: "Test Customer Property Description",
      property_type: "TEXT",
      settings: {
        display_format: "single-line",
      },
    });

    expect(customerProperty).toBeDefined();
    expect(customerProperty.id).toBeDefined();
    expect(customerProperty.name).toBe(name);
    expect(customerProperty.description).toBe("Test Customer Property Description");
  });

  it("should retrieve a customer property", async () => {
    const retrievedCustomerProperty = await client.customers.properties.retrievePropertyDefinition(
      workspaceSlug,
      customerProperty.id!
    );

    expect(retrievedCustomerProperty).toBeDefined();
    expect(retrievedCustomerProperty.id).toBe(customerProperty.id);
    expect(retrievedCustomerProperty.name).toBe(customerProperty.name);
  });

  it("should update a customer property", async () => {
    const updatedCustomerProperty = await client.customers.properties.updatePropertyDefinition(
      workspaceSlug,
      customerProperty.id!,
      {
        display_name: randomizeName("Updated Test Customer Property"),
        description: "Updated Test Customer Property Description",
      }
    );

    expect(updatedCustomerProperty).toBeDefined();
    expect(updatedCustomerProperty.id).toBe(customerProperty.id);
    expect(updatedCustomerProperty.description).toBe("Updated Test Customer Property Description");
  });

  it("should list customer properties", async () => {
    const customerProperties = await client.customers.properties.listPropertyDefinitions(workspaceSlug);

    expect(Array.isArray(customerProperties.results)).toBe(true);
    expect(customerProperties.results.length).toBeGreaterThan(0);

    const foundProperty = customerProperties.results.find((p) => p.id === customerProperty.id);
    expect(foundProperty).toBeDefined();
  });

  it("should update a customer property value", async () => {
    const customerPropertyValue = await client.customers.properties.updateValue(
      workspaceSlug,
      customerId,
      customerProperty.id!,
      {
        values: ["Property Value Updated"],
      }
    );

    expect(customerPropertyValue).toBeDefined();
  });

  it("should list customer property values", async () => {
    const allCustomerPropertyValues = await client.customers.properties.listValues(workspaceSlug, customerId);

    expect(allCustomerPropertyValues).toBeDefined();
    expect(Object.keys(allCustomerPropertyValues).length).toBeGreaterThan(0);
    expect(Array.isArray(allCustomerPropertyValues[customerProperty.id])).toBe(true);
    expect(allCustomerPropertyValues[customerProperty.id].length).toBeGreaterThan(0);
  });

  it("should retrieve a customer property value", async () => {
    const retrievedCustomerPropertyValue = await client.customers.properties.retrieveValue(
      workspaceSlug,
      customerId,
      customerProperty.id!
    );

    expect(retrievedCustomerPropertyValue).toBeDefined();
  });
});
