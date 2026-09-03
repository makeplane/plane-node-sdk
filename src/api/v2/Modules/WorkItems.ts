import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work-item membership of a module, at `proj.modules.workItems`. 1..100 ids per call; resolves to the ids actually changed. */
export class ModuleWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/modules/{module_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    manage: "modules_work_items_manage",
  };

  /** Add work items to the module; already-present ids are omitted from the result. */
  add(moduleId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { module_id: moduleId });
  }

  /** Remove work items from the module; ids not in it are skipped. */
  remove(moduleId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { module_id: moduleId });
  }
}
