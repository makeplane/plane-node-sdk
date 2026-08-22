import { WorkItemDependencyCreateRequest, WorkItemDependencyList } from "../../../models/v2/WorkItemDependency";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Typed dependencies between work items. `list` returns one grouped object, not a `Page<T>`. */
export class Dependencies extends V2Resource<WorkItemDependencyList, WorkItemDependencyCreateRequest, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/dependencies/";
  protected operations: Record<string, AnyOperationId> = {
    list: "work_item_dependencies_list",
    create: "work_item_dependencies_create",
    delete: "work_item_dependencies_destroy",
  };

  private pathParams(workItemId: string): Record<string, string> {
    return { work_item_id: workItemId };
  }

  /** Dependency work-item ids grouped by the six fixed keys, from this work item's perspective. */
  async list(workItemId: string): Promise<WorkItemDependencyList> {
    return this.transport.request<WorkItemDependencyList>("GET", this.collectionUrl(this.pathParams(workItemId)));
  }

  /** Add a typed dependency (`data.relation_type`) between this work item and `data.work_item_ids`. */
  async create(workItemId: string, data: WorkItemDependencyCreateRequest): Promise<WorkItemDependencyList> {
    return this.transport.request<WorkItemDependencyList>("POST", this.collectionUrl(this.pathParams(workItemId)), {
      data,
    });
  }

  /** Remove the dependency on `relatedWorkItemId` — the row is addressed by the related work item, not a row id. */
  async delete(workItemId: string, relatedWorkItemId: string): Promise<void> {
    const base = this.collectionUrl(this.pathParams(workItemId));
    await this.transport.request<void>("DELETE", `${base}${encodeURIComponent(relatedWorkItemId)}/`);
  }
}
