import { PlaneClient } from "../../../src/client/plane-client";
import { config } from "../constants";
import { createTestClient } from "../test-utils";

export async function testCustomersWorkItems() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const customerId = config.customerId;
  const workItemId = config.workItemId;

  if (!workspaceSlug || !customerId || !workItemId) {
    console.error("workspaceSlug, customerId and workItemId are required");
    return;
  }

  const customer = await linkWorkItemsToCustomer(client, workspaceSlug, customerId, [workItemId]);
  console.log("Linked work items to customer: ", customer);

  const retrievedCustomerWorkItems = await listCustomerWorkItems(client, workspaceSlug, customerId);
  console.log("Retrieved customer work items: ", retrievedCustomerWorkItems);

  const updatedCustomer = await unlinkWorkItemFromCustomer(client, workspaceSlug, customerId, workItemId);
  console.log("Unlinked work item from customer: ", updatedCustomer);
}

async function linkWorkItemsToCustomer(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string,
  issueIds: string[]
) {
  const customer = await client.customers.linkIssuesToCustomer(workspaceSlug, customerId, issueIds);
  return customer;
}

async function listCustomerWorkItems(client: PlaneClient, workspaceSlug: string, customerId: string) {
  const customer = await client.customers.listCustomerIssues(workspaceSlug, customerId);
  return customer;
}

async function unlinkWorkItemFromCustomer(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string,
  issueId: string
) {
  return await client.customers.unlinkIssueFromCustomer(workspaceSlug, customerId, issueId);
}

if (require.main === module) {
  testCustomersWorkItems().catch(console.error);
}
