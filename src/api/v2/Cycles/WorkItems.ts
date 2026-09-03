import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work-item membership of a cycle, at `proj.cycles.workItems`. 1..100 ids per call; resolves to the ids actually changed. */
export class CycleWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/cycles/{cycle_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    manage: "cycles_work_items_manage",
  };

  /** Move work items into the cycle (re-homing any already in another cycle). Blocked once the cycle is completed. */
  add(cycleId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { cycle_id: cycleId });
  }

  /** Take work items out of the cycle; ids not in it are skipped. */
  remove(cycleId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { cycle_id: cycleId });
  }
}
