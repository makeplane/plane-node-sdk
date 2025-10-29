import { PlaneClient } from "../../../src/client/plane-client";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.customerId && config.workItemId), "Customer Work Items API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let customerId: string;
  let workItemId: string;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    customerId = config.customerId;
    workItemId = config.workItemId;
  });

  it("should link work items to customer", async () => {
    const linkedIssues = await client.customers.linkIssuesToCustomer(workspaceSlug, customerId, [workItemId]);

    expect(linkedIssues).toBeDefined();
    expect(linkedIssues.linked_issues.length).toBe(1);
  });

  it("should list customer work items", async () => {
    const customerWorkItems = await client.customers.listCustomerIssues(workspaceSlug, customerId);

    expect(customerWorkItems.length).toBeGreaterThan(0);

    const foundWorkItem = customerWorkItems.find((wi) => wi.id === workItemId);
    expect(foundWorkItem).toBeDefined();
  });

  it("should unlink work item from customer", async () => {
    await client.customers.unlinkIssueFromCustomer(workspaceSlug, customerId, workItemId);
  });
});
