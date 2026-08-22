import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import {
  WorkItemComment,
  WorkItemCommentAccess,
  UpdateWorkItemComment,
  CreateWorkItemComment,
} from "../../../models/v2/WorkItemComment";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type WorkItemCommentField = (typeof FIELDS)["comments_list"][number];
export type WorkItemCommentOrderBy = (typeof ORDER_BY)["comments_list"][number];
/** Only `"actor"` — see `WorkItemExpand` for the much larger set on the work item itself. */
export type WorkItemCommentExpand = (typeof EXPAND)["comments_list"][number];

export interface ListWorkItemCommentsParams {
  fields?: readonly WorkItemCommentField[];
  access?: WorkItemCommentAccess;
  external_id?: string;
  external_source?: string;
  search?: string;
  expand?: readonly WorkItemCommentExpand[];
  order_by?: WorkItemCommentOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Comments on a work item (api_v2). Its own upsert/bulk actions, distinct operation ids from the CRUD ones. */
export class Comments extends V2Resource<WorkItemComment, CreateWorkItemComment, UpdateWorkItemComment> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/comments/";
  protected operations: Record<string, AnyOperationId> = {
    list: "comments_list",
    retrieve: "comments_retrieve",
    create: "comments_create",
    update: "comments_partial_update",
    upsert: "work_item_comments_upsert",
    delete: "comments_destroy",
    bulkCreate: "work_item_comments_bulk_create",
    bulkUpdate: "work_item_comments_bulk_update",
    bulkDelete: "work_item_comments_bulk_delete",
  };

  private pk(workItemId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { work_item_id: workItemId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemCommentField, "all"> & keyof WorkItemComment>(
    workItemId: string,
    params: ListWorkItemCommentsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemComment, F | "id">>>;
  list(workItemId: string, params?: ListWorkItemCommentsParams): Promise<Page<WorkItemComment>>;
  list(workItemId: string, params?: ListWorkItemCommentsParams): Promise<Page<WorkItemComment>> {
    return this.doList(this.pk(workItemId), params as Record<string, unknown>);
  }

  /** Every comment, following pages automatically. */
  iterate(workItemId: string, params?: ListWorkItemCommentsParams): AsyncGenerator<WorkItemComment> {
    return this.doIterate(this.pk(workItemId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemCommentField, "all"> & keyof WorkItemComment>(
    workItemId: string,
    commentId: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemCommentExpand[] }
  ): Promise<Pick<WorkItemComment, F | "id">>;
  retrieve(
    workItemId: string,
    commentId: string,
    params?: { fields?: readonly WorkItemCommentField[]; expand?: readonly WorkItemCommentExpand[] }
  ): Promise<WorkItemComment>;
  retrieve(
    workItemId: string,
    commentId: string,
    params?: { fields?: readonly WorkItemCommentField[]; expand?: readonly WorkItemCommentExpand[] }
  ): Promise<WorkItemComment> {
    return this.doRetrieve(this.pk(workItemId, commentId), params as Record<string, unknown>);
  }

  create(
    workItemId: string,
    data: CreateWorkItemComment,
    params?: { fields?: readonly WorkItemCommentField[]; expand?: readonly WorkItemCommentExpand[] }
  ): Promise<WorkItemComment> {
    return this.doCreate(data, this.pk(workItemId), params as Record<string, unknown>);
  }

  update(
    workItemId: string,
    commentId: string,
    data: UpdateWorkItemComment,
    params?: { fields?: readonly WorkItemCommentField[]; expand?: readonly WorkItemCommentExpand[] }
  ): Promise<WorkItemComment> {
    return this.doUpdate(data, this.pk(workItemId, commentId), params as Record<string, unknown>);
  }

  delete(workItemId: string, commentId: string): Promise<void> {
    return this.doDelete(this.pk(workItemId, commentId));
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(
    workItemId: string,
    data: CreateWorkItemComment,
    params?: { fields?: readonly WorkItemCommentField[]; expand?: readonly WorkItemCommentExpand[] }
  ): Promise<WorkItemComment> {
    return this.doUpsert(data, this.pk(workItemId), params as Record<string, unknown>);
  }

  bulkCreate(workItemId: string, items: CreateWorkItemComment[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, this.pk(workItemId), allOrNone);
  }

  bulkUpdate(
    workItemId: string,
    items: BulkUpdateItem<UpdateWorkItemComment>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, this.pk(workItemId), allOrNone);
  }

  bulkDelete(workItemId: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, this.pk(workItemId), allOrNone);
  }
}
