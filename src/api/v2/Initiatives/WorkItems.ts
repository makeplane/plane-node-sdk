import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work items (any type, epics included) on an initiative, at `ws.initiatives.workItems`; replaces v1 `/epics/`. Invalid/out-of-workspace ids are skipped. */
export class InitiativeWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/initiatives/{initiative_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    manage: "initiatives_work_items",
  };

  /** Add work items to the initiative (1..100 ids); resolves to the ids actually added. */
  add(initiativeId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { initiative_id: initiativeId });
  }

  /** Remove work items from the initiative (1..100 ids); resolves to the ids actually removed. */
  remove(initiativeId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { initiative_id: initiativeId });
  }
}
