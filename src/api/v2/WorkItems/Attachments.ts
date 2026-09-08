import { Page } from "../../../models/v2/common";
import {
  WorkItemAttachment,
  WorkItemAttachmentConfirmRequest,
  WorkItemAttachmentUploadRequest,
} from "../../../models/v2/WorkItemAttachment";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkItemAttachmentField = (typeof FIELDS)["attachments_list"][number];
export type WorkItemAttachmentOrderBy = (typeof ORDER_BY)["attachments_list"][number];

export interface ListWorkItemAttachmentsParams {
  fields?: readonly WorkItemAttachmentField[];
  external_id?: string;
  external_source?: string;
  is_uploaded?: boolean;
  order_by?: WorkItemAttachmentOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface WorkItemAttachmentFieldsParams {
  fields?: readonly WorkItemAttachmentField[];
}

/**
 * Work item attachments. `create` returns upload credentials; `update` confirms the upload.
 */
export class Attachments extends V2Resource<
  WorkItemAttachment,
  WorkItemAttachmentUploadRequest,
  WorkItemAttachmentConfirmRequest
> {
  /** Exported from the v2 barrel as `WorkItemAttachments`; `exported-names.test.ts` pins the two together. */
  static readonly publicName = "WorkItemAttachments";

  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/attachments/";
  protected operations: Record<string, OperationId> = {
    list: "attachments_list",
    retrieve: "attachments_retrieve",
    create: "attachments_create",
    update: "attachments_partial_update",
    delete: "attachments_destroy",
  };

  /**
   * One page of `WorkItemAttachment` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WorkItemAttachmentField, "all"> & keyof WorkItemAttachment>(
    slug: string,
    project: string,
    workItem: string,
    params: ListWorkItemAttachmentsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemAttachment, F | "id">>>;
  /** One page of `WorkItemAttachment` rows. Use `iterate` to follow pages automatically. */
  list(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemAttachmentsParams
  ): Promise<Page<WorkItemAttachment>>;
  list(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemAttachmentsParams
  ): Promise<Page<WorkItemAttachment>> {
    return this.doList({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  /** Every attachment, following pages automatically. */
  iterate<F extends Exclude<WorkItemAttachmentField, "all"> & keyof WorkItemAttachment>(
    slug: string,
    project: string,
    workItem: string,
    params: Omit<ListWorkItemAttachmentsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemAttachment, F | "id">>;
  /** Every attachment, following pages automatically. */
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: Omit<ListWorkItemAttachmentsParams, "offset" | "count">
  ): AsyncGenerator<WorkItemAttachment>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: Omit<ListWorkItemAttachmentsParams, "offset" | "count">
  ): AsyncGenerator<WorkItemAttachment> {
    return this.doIterate({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemAttachmentField, "all"> & keyof WorkItemAttachment>(
    slug: string,
    project: string,
    workItem: string,
    attachment: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemAttachment, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    attachment: string,
    params?: WorkItemAttachmentFieldsParams
  ): Promise<WorkItemAttachment>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    attachment: string,
    params?: WorkItemAttachmentFieldsParams
  ): Promise<WorkItemAttachment> {
    return this.doRetrieve(
      { slug, project_id: project, work_item_id: workItem, pk: attachment },
      params as Record<string, unknown>
    );
  }

  /**
   * Step 1: get upload credentials. Follow up with `update(..., { is_uploaded: true })`
   * once the bytes land.
   *
   * Deliberately offers no `fields`, though `attachments_create` declares it: the live
   * envelope is richer than the golden documents and its presigned upload data exists
   * only in this reply, so a projection could strand the caller mid-upload with no way
   * to re-fetch it. Named in `ONE_TIME_RESPONSES` in
   * `tests/unit/v2/fields-coverage.test.ts`.
   */
  create(
    slug: string,
    project: string,
    workItem: string,
    data: WorkItemAttachmentUploadRequest
  ): Promise<WorkItemAttachment> {
    return this.doCreate(data, { slug, project_id: project, work_item_id: workItem });
  }

  /** Step 2: confirm the upload. */
  update<F extends Exclude<WorkItemAttachmentField, "all"> & keyof WorkItemAttachment>(
    slug: string,
    project: string,
    workItem: string,
    attachment: string,
    data: WorkItemAttachmentConfirmRequest,
    params: WorkItemAttachmentFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemAttachment, F | "id">>;
  /** Step 2: confirm the upload. */
  update(
    slug: string,
    project: string,
    workItem: string,
    attachment: string,
    data: WorkItemAttachmentConfirmRequest,
    params?: WorkItemAttachmentFieldsParams
  ): Promise<WorkItemAttachment>;
  update(
    slug: string,
    project: string,
    workItem: string,
    attachment: string,
    data: WorkItemAttachmentConfirmRequest,
    params?: WorkItemAttachmentFieldsParams
  ): Promise<WorkItemAttachment> {
    return this.doUpdate(
      data,
      { slug, project_id: project, work_item_id: workItem, pk: attachment },
      params as Record<string, unknown>
    );
  }

  delete(slug: string, project: string, workItem: string, attachment: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, work_item_id: workItem, pk: attachment });
  }
}
