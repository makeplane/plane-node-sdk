import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work-item membership of a milestone, at `proj.milestones.workItems`. 1..100 ids per call; resolves to the ids actually changed. */
export class MilestoneWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/milestones/{milestone_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    manage: "milestones_work_items",
  };

  /** Add work items to the milestone; already-present ids are omitted from the result. */
  add(milestoneId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { milestone_id: milestoneId });
  }

  /** Remove work items from the milestone; ids not in it are skipped. */
  remove(milestoneId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { milestone_id: milestoneId });
  }
}
