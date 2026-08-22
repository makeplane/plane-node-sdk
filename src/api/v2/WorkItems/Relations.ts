import { WorkItemRelationCreateRequest, WorkItemRelationList } from "../../../models/v2/WorkItemRelation";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Relations between work items. `list` returns one grouped object, not a `Page<T>`; `delete` uses `related_work_item_id`. */
export class Relations extends V2Resource<WorkItemRelationList, WorkItemRelationCreateRequest, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/relations/";
  protected operations: Record<string, AnyOperationId> = {
    list: "work_item_relations_list",
    create: "work_item_relations_create",
    delete: "work_item_relations_destroy",
  };

  private pathParams(workItemId: string): Record<string, string> {
    return { work_item_id: workItemId };
  }

  /** Related work-item ids grouped by direction label (a relation definition's outward or inward label). */
  async list(workItemId: string): Promise<WorkItemRelationList> {
    return this.transport.request<WorkItemRelationList>("GET", this.collectionUrl(this.pathParams(workItemId)));
  }

  /** Link this work item to `data.work_item_ids` through `data.relation_definition_id`. */
  async create(workItemId: string, data: WorkItemRelationCreateRequest): Promise<WorkItemRelationList> {
    return this.transport.request<WorkItemRelationList>("POST", this.collectionUrl(this.pathParams(workItemId)), {
      data,
    });
  }

  /** Unlink `relatedWorkItemId` — the row is addressed by the related work item, not a relation-row id. */
  async delete(workItemId: string, relatedWorkItemId: string): Promise<void> {
    const base = this.collectionUrl(this.pathParams(workItemId));
    await this.transport.request<void>("DELETE", `${base}${encodeURIComponent(relatedWorkItemId)}/`);
  }
}
