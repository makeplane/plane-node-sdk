import { PlaneClient } from "../../../src/client/plane-client";
import { CustomerRequest } from "../../../src/models/Customer";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.customerId), "Customer Requests API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let customerId: string;
  let customerRequest: CustomerRequest;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    customerId = config.customerId;
  });

  afterAll(async () => {
    // Clean up created customer request
    if (customerRequest?.id) {
      try {
        await client.customers.requests.delete(workspaceSlug, customerId, customerRequest.id);
      } catch (error) {
        console.warn("Failed to delete customer request:", error);
      }
    }
  });

  it("should create a customer request", async () => {
    customerRequest = await client.customers.requests.create(workspaceSlug, customerId, {
      name: randomizeName("Test Customer Request"),
      description: "Test Customer Request Description",
    });

    expect(customerRequest).toBeDefined();
    expect(customerRequest.id).toBeDefined();
    expect(customerRequest.name).toContain("Test Customer Request");
    expect(customerRequest.description).toBe("Test Customer Request Description");
  });

  it("should retrieve a customer request", async () => {
    const retrievedCustomerRequest = await client.customers.requests.retrieve(
      workspaceSlug,
      customerId,
      customerRequest.id!
    );

    expect(retrievedCustomerRequest).toBeDefined();
    expect(retrievedCustomerRequest.id).toBe(customerRequest.id);
    expect(retrievedCustomerRequest.name).toBe(customerRequest.name);
  });

  it("should update a customer request", async () => {
    const updatedCustomerRequest = await client.customers.requests.update(
      workspaceSlug,
      customerId,
      customerRequest.id!,
      {
        name: randomizeName("Updated Test Customer Request"),
        description: "Updated Test Customer Request Description",
      }
    );

    expect(updatedCustomerRequest).toBeDefined();
    expect(updatedCustomerRequest.id).toBe(customerRequest.id);
    expect(updatedCustomerRequest.name).toContain("Updated Test Customer Request");
    expect(updatedCustomerRequest.description).toBe("Updated Test Customer Request Description");
  });

  it("should list customer requests", async () => {
    const customerRequests = await client.customers.requests.list(workspaceSlug, customerId);

    expect(customerRequests.results.length).toBeGreaterThan(0);

    const foundRequest = customerRequests.results.find((r) => r.id === customerRequest.id);
    expect(foundRequest).toBeDefined();
  });
});
