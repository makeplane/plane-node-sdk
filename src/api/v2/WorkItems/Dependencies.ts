import { WorkItemDependencyCreateRequest, WorkItemDependencyList } from "../../../models/v2/WorkItemDependency";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/**
 * Typed dependencies between work items — the same non-paginated, dict-shaped `list` and
 * pair-keyed `delete` as `WorkItemRelations` (read its doc comment for both), except that
 * the directions here are six fixed keys the API defines rather than a per-workspace
 * label set.
 */
export class Dependencies extends V2Resource<WorkItemDependencyList, WorkItemDependencyCreateRequest, never> {
  /** Exported from the v2 barrel as `WorkItemDependencies`; `exported-names.test.ts` pins the two together. */
  static readonly publicName = "WorkItemDependencies";

  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/dependencies/";
  protected operations: Record<string, AnyOperationId> = {
    list: "work_item_dependencies_list",
    create: "work_item_dependencies_create",
    delete: "work_item_dependencies_destroy",
  };

  /** Dependency work-item ids grouped by the six fixed keys, from this work item's perspective. */
  list(slug: string, project: string, workItem: string): Promise<WorkItemDependencyList> {
    return this.doRetrieveSingleton<WorkItemDependencyList>(
      { slug, project_id: project, work_item_id: workItem },
      "list"
    );
  }

  /** Add a typed dependency (`data.relation_type`) between this work item and `data.work_item_ids`. */
  create(
    slug: string,
    project: string,
    workItem: string,
    data: WorkItemDependencyCreateRequest
  ): Promise<WorkItemDependencyList> {
    return this.doCreate(data, { slug, project_id: project, work_item_id: workItem });
  }

  /** Remove the dependency on `relatedWorkItem` — keyed by the related work item, not a row id. */
  delete(slug: string, project: string, workItem: string, relatedWorkItem: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, work_item_id: workItem, pk: relatedWorkItem });
  }
}
