import { AnyOperationId, V2Resource } from "../kernel/resource";

/**
 * Work-item membership of a cycle.
 *
 * Reached flat — `v2.workspaces.projects.cycles.workItems.add(slug, project, cycle, ids)` — or from a
 * fetched cycle, which supplies all three leading ids: `cycle.workItems.add(ids)`.
 * 1..100 ids per call; resolves to the ids actually changed.
 */
export class CycleWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/cycles/{cycle_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    // One operation, two verbs: `doBridge` POSTs `{add}` or `{remove}` to the same URL,
    // and every public method needs a key of its own (see `operations-coverage.test.ts`).
    add: "cycles_work_items_manage",
    remove: "cycles_work_items_manage",
  };

  /** Move work items into the cycle (re-homing any already in another cycle). Blocked once the cycle is completed. */
  add(slug: string, project: string, cycle: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { slug, project_id: project, cycle_id: cycle });
  }

  /** Take work items out of the cycle; ids not in it are skipped. */
  remove(slug: string, project: string, cycle: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { slug, project_id: project, cycle_id: cycle });
  }
}
