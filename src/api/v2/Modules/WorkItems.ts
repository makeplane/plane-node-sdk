import { AnyOperationId, V2Resource } from "../kernel/resource";

/**
 * Work-item membership of a module.
 *
 * Reached flat — `v2.workspaces.projects.modules.workItems.add(slug, project, module, ids)` — or from
 * a fetched module, which supplies all three leading ids: `module.workItems.add(ids)`.
 * 1..100 ids per call; resolves to the ids actually changed.
 */
export class ModuleWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/modules/{module_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    // One operation, two verbs: `doBridge` POSTs `{add}` or `{remove}` to the same URL,
    // and every public method needs a key of its own (see `operations-coverage.test.ts`).
    add: "modules_work_items_manage",
    remove: "modules_work_items_manage",
  };

  /** Add work items to the module; already-present ids are omitted from the result. */
  add(slug: string, project: string, module: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { slug, project_id: project, module_id: module });
  }

  /** Remove work items from the module; ids not in it are skipped. */
  remove(slug: string, project: string, module: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { slug, project_id: project, module_id: module });
  }
}
