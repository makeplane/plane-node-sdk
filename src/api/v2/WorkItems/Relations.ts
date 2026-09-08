import { WorkItemRelationCreateRequest, WorkItemRelationList } from "../../../models/v2/WorkItemRelation";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/**
 * Relations between work items — directions come from the workspace's own relation
 * definitions, so the label set is dynamic (see `WorkItemRelationDefinitions`).
 *
 * Two shapes worth knowing. `list` answers **one dict-shaped object** keyed by direction
 * label, not a `Page<T>`, so it reads through the kernel's singleton helper under a
 * `list` action — the same URL, plus the golden's own query validation. And `delete` is
 * keyed by the **related** work item: the API mints no id for a relation row, so the
 * pair `(workItem, relatedWorkItem)` is what identifies the one to remove.
 */
export class Relations extends V2Resource<WorkItemRelationList, WorkItemRelationCreateRequest, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/relations/";
  protected operations: Record<string, AnyOperationId> = {
    list: "work_item_relations_list",
    create: "work_item_relations_create",
    delete: "work_item_relations_destroy",
  };

  /** Related work-item ids grouped by direction label (a relation definition's outward or inward label). */
  list(slug: string, project: string, workItem: string): Promise<WorkItemRelationList> {
    return this.doRetrieveSingleton<WorkItemRelationList>(
      { slug, project_id: project, work_item_id: workItem },
      "list"
    );
  }

  /** Link this work item to `data.work_item_ids` through `data.relation_definition_id`. */
  create(
    slug: string,
    project: string,
    workItem: string,
    data: WorkItemRelationCreateRequest
  ): Promise<WorkItemRelationList> {
    return this.doCreate(data, { slug, project_id: project, work_item_id: workItem });
  }

  /** Unlink `relatedWorkItem` — see this class's own doc comment for why that, and not a relation-row id. */
  delete(slug: string, project: string, workItem: string, relatedWorkItem: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, work_item_id: workItem, pk: relatedWorkItem });
  }
}
