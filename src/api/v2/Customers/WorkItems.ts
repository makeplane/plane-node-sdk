import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work items linked directly to a customer, at `ws.customers.workItems`. 1..100 ids per call; invalid/archived ids are silently skipped. */
export class CustomerWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/customers/{customer_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    manage: "customers_work_items",
  };

  /** Link work items to the customer; resolves to the ids actually linked. */
  add(customerId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { customer_id: customerId });
  }

  /** Unlink work items from the customer; resolves to the ids actually unlinked. */
  remove(customerId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { customer_id: customerId });
  }
}
