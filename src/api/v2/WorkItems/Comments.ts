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

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface WorkItemCommentShapeParams {
  fields?: readonly WorkItemCommentField[];
  expand?: readonly WorkItemCommentExpand[];
}

/**
 * Comments on a work item (api_v2). Its own upsert/bulk actions, distinct operation ids
 * from the CRUD ones.
 *
 * Reached flat — `v2.workspaces.projects.workItems.comments.list(slug, project, workItem)` — or
 * from a fetched work item, which supplies all three leading ids:
 * `workItem.comments.list()`.
 */
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

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemCommentField, "all"> & keyof WorkItemComment>(
    slug: string,
    project: string,
    workItem: string,
    params: ListWorkItemCommentsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemComment, F | "id">>>;
  list(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemCommentsParams
  ): Promise<Page<WorkItemComment>>;
  list(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemCommentsParams
  ): Promise<Page<WorkItemComment>> {
    return this.doList({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  /** Every comment on the work item, following pages automatically. */
  iterate<F extends Exclude<WorkItemCommentField, "all"> & keyof WorkItemComment>(
    slug: string,
    project: string,
    workItem: string,
    params: ListWorkItemCommentsParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemComment, F | "id">>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemCommentsParams
  ): AsyncGenerator<WorkItemComment>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemCommentsParams
  ): AsyncGenerator<WorkItemComment> {
    return this.doIterate({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemCommentField, "all"> & keyof WorkItemComment>(
    slug: string,
    project: string,
    workItem: string,
    comment: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemCommentExpand[] }
  ): Promise<Pick<WorkItemComment, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    comment: string,
    params?: WorkItemCommentShapeParams
  ): Promise<WorkItemComment>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    comment: string,
    params?: WorkItemCommentShapeParams
  ): Promise<WorkItemComment> {
    return this.doRetrieve(
      { slug, project_id: project, work_item_id: workItem, pk: comment },
      params as Record<string, unknown>
    );
  }

  create<F extends Exclude<WorkItemCommentField, "all"> & keyof WorkItemComment>(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemComment,
    params: WorkItemCommentShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemComment, F | "id">>;
  create(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemComment,
    params?: WorkItemCommentShapeParams
  ): Promise<WorkItemComment>;
  create(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemComment,
    params?: WorkItemCommentShapeParams
  ): Promise<WorkItemComment> {
    return this.doCreate(
      data,
      { slug, project_id: project, work_item_id: workItem },
      params as Record<string, unknown>
    );
  }

  update<F extends Exclude<WorkItemCommentField, "all"> & keyof WorkItemComment>(
    slug: string,
    project: string,
    workItem: string,
    comment: string,
    data: UpdateWorkItemComment,
    params: WorkItemCommentShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemComment, F | "id">>;
  update(
    slug: string,
    project: string,
    workItem: string,
    comment: string,
    data: UpdateWorkItemComment,
    params?: WorkItemCommentShapeParams
  ): Promise<WorkItemComment>;
  update(
    slug: string,
    project: string,
    workItem: string,
    comment: string,
    data: UpdateWorkItemComment,
    params?: WorkItemCommentShapeParams
  ): Promise<WorkItemComment> {
    return this.doUpdate(
      data,
      { slug, project_id: project, work_item_id: workItem, pk: comment },
      params as Record<string, unknown>
    );
  }

  delete(slug: string, project: string, workItem: string, comment: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, work_item_id: workItem, pk: comment });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<WorkItemCommentField, "all"> & keyof WorkItemComment>(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemComment,
    params: WorkItemCommentShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemComment, F | "id">>;
  upsert(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemComment,
    params?: WorkItemCommentShapeParams
  ): Promise<WorkItemComment>;
  upsert(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemComment,
    params?: WorkItemCommentShapeParams
  ): Promise<WorkItemComment> {
    return this.doUpsert(
      data,
      { slug, project_id: project, work_item_id: workItem },
      params as Record<string, unknown>
    );
  }

  bulkCreate(
    slug: string,
    project: string,
    workItem: string,
    items: CreateWorkItemComment[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug, project_id: project, work_item_id: workItem }, allOrNone);
  }

  /** Each item is the patch plus the target `id`. */
  bulkUpdate(
    slug: string,
    project: string,
    workItem: string,
    items: BulkUpdateItem<UpdateWorkItemComment>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug, project_id: project, work_item_id: workItem }, allOrNone);
  }

  bulkDelete(
    slug: string,
    project: string,
    workItem: string,
    ids: string[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, { slug, project_id: project, work_item_id: workItem }, allOrNone);
  }
}
