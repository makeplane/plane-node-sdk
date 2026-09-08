import { AnyOperationId, V2Resource } from "../kernel/resource";

/**
 * Work-item membership of a milestone.
 *
 * Reached flat — `v2.workspaces.projects.milestones.workItems.add(slug, project, milestone, ids)` — or
 * from a fetched milestone, which supplies all three leading ids:
 * `milestone.workItems.add(ids)`. 1..100 ids per call; resolves to the ids actually changed.
 */
export class MilestoneWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/milestones/{milestone_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    // One operation, two verbs: `doBridge` POSTs `{add}` or `{remove}` to the same URL,
    // and every public method needs a key of its own (see `operations-coverage.test.ts`).
    add: "milestones_work_items",
    remove: "milestones_work_items",
  };

  /** Add work items to the milestone; already-present ids are omitted from the result. */
  add(slug: string, project: string, milestone: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { slug, project_id: project, milestone_id: milestone });
  }

  /** Remove work items from the milestone; ids not in it are skipped. */
  remove(slug: string, project: string, milestone: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { slug, project_id: project, milestone_id: milestone });
  }
}
