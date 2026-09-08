import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work items linked directly to a customer, reached flat as `v2.workspaces.customers.workItems.add(slug, customer, ids)`, or from a fetched customer as `customer.workItems.add(ids)`. 1..100 ids per call; invalid/archived ids are silently skipped. */
export class CustomerWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/customers/{customer_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    // One operation, two verbs — see `CycleWorkItems.operations`.
    add: "customers_work_items",
    remove: "customers_work_items",
  };

  /** Link work items to the customer; resolves to the ids actually linked. */
  add(slug: string, customer: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { slug, customer_id: customer });
  }

  /** Unlink work items from the customer; resolves to the ids actually unlinked. */
  remove(slug: string, customer: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { slug, customer_id: customer });
  }
}
