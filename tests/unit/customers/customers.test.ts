import { PlaneClient } from "../../../src/client/plane-client";
import { Customer } from "../../../src/models/Customer";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!config.workspaceSlug, "Customer API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let customer: Customer;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    // Clean up created customer
    if (customer?.id) {
      try {
        await client.customers.delete(workspaceSlug, customer.id);
      } catch (error) {
        console.warn("Failed to delete customer:", error);
      }
    }
  });

  it("should create a customer", async () => {
    customer = await client.customers.create(workspaceSlug, {
      name: randomizeName("Test Customer"),
      description: "Test Customer Description",
    });

    expect(customer).toBeDefined();
    expect(customer.id).toBeDefined();
    expect(customer.name).toContain("Test Customer");
    expect(customer.description).toBe("Test Customer Description");
  });

  it("should retrieve a customer", async () => {
    const retrievedCustomer = await client.customers.retrieve(workspaceSlug, customer.id!);

    expect(retrievedCustomer).toBeDefined();
    expect(retrievedCustomer.id).toBe(customer.id);
    expect(retrievedCustomer.name).toBe(customer.name);
    expect(retrievedCustomer.description).toBe(customer.description);
  });

  it("should update a customer", async () => {
    const updatedCustomer = await client.customers.update(workspaceSlug, customer.id!, {
      name: randomizeName("Updated Test Customer"),
      description: "Updated Test Customer Description",
    });

    expect(updatedCustomer).toBeDefined();
    expect(updatedCustomer.id).toBe(customer.id);
    expect(updatedCustomer.name).toContain("Updated Test Customer");
    expect(updatedCustomer.description).toBe("Updated Test Customer Description");
  });

  it("should list customers", async () => {
    const customers = await client.customers.list(workspaceSlug, {
      limit: 10,
      offset: 0,
    });

    expect(customers).toBeDefined();
    expect(Array.isArray(customers.results)).toBe(true);
    expect(customers.results.length).toBeGreaterThan(0);

    const foundCustomer = customers.results.find((c) => c.id === customer.id);
    expect(foundCustomer).toBeDefined();
  });
});
