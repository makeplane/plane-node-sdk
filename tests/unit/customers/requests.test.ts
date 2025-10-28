import { PlaneClient } from "../../src/client/plane-client";
import { config } from "../constants";
import { createTestClient } from "../test-utils";

export async function testCustomersRequests() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const customerId = config.customerId;

  const customerRequest = await createCustomerRequest(
    client,
    workspaceSlug,
    customerId
  );
  console.log("Created customer request: ", customerRequest);

  const retrievedCustomerRequest = await retrieveCustomerRequest(
    client,
    workspaceSlug,
    customerId,
    customerRequest.id
  );
  console.log("Retrieved customer request: ", retrievedCustomerRequest);

  const updatedCustomerRequest = await updateCustomerRequest(
    client,
    workspaceSlug,
    customerId,
    customerRequest.id
  );
  console.log("Updated customer request: ", updatedCustomerRequest);

  const customerRequests = await listCustomerRequests(
    client,
    workspaceSlug,
    customerId
  );
  console.log("Listed customer requests: ", customerRequests);

  await deleteCustomerRequest(
    client,
    workspaceSlug,
    customerId,
    customerRequest.id
  );
  console.log("Deleted customer request: ", customerRequest.id);
}

async function createCustomerRequest(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string
) {
  const customerRequest = await client.customers.requests.create(
    workspaceSlug,
    customerId,
    {
      name: `Test Customer Request ${new Date().getTime()}`,
      description: "Test Customer Request Description",
    }
  );
  return customerRequest;
}

async function retrieveCustomerRequest(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string,
  requestId: string
) {
  const customerRequest = await client.customers.requests.retrieve(
    workspaceSlug,
    customerId,
    requestId
  );
  return customerRequest;
}

async function updateCustomerRequest(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string,
  requestId: string
) {
  return await client.customers.requests.update(
    workspaceSlug,
    customerId,
    requestId,
    {
      name: `Updated Test Customer Request ${new Date().getTime()}`,
      description: "Updated Test Customer Request Description",
    }
  );
}

async function listCustomerRequests(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string
) {
  const customerRequests = await client.customers.requests.list(
    workspaceSlug,
    customerId,
    {
      limit: 10,
      offset: 0,
    }
  );
  return customerRequests;
}

async function deleteCustomerRequest(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string,
  requestId: string
) {
  await client.customers.requests.delete(workspaceSlug, customerId, requestId);
}

if (require.main === module) {
  testCustomersRequests().catch(console.error);
}
