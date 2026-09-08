import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work items (any type, epics included) on an initiative, reached flat as `v2.workspaces.initiatives.workItems.add(slug, initiative, ids)`, or from a fetched initiative as `initiative.workItems.add(ids)`; replaces v1 `/epics/`. Invalid/out-of-workspace ids are skipped. */
export class InitiativeWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/initiatives/{initiative_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    // One operation, two verbs — see `CycleWorkItems.operations`.
    add: "initiatives_work_items",
    remove: "initiatives_work_items",
  };

  /** Add work items to the initiative (1..100 ids); resolves to the ids actually added. */
  add(slug: string, initiative: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { slug, initiative_id: initiative });
  }

  /** Remove work items from the initiative (1..100 ids); resolves to the ids actually removed. */
  remove(slug: string, initiative: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { slug, initiative_id: initiative });
  }
}
