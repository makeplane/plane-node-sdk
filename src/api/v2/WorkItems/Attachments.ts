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
  count?: boolean;
}

/**
 * Work item attachments. `create` returns upload credentials; `update` confirms the upload.
 */
export class Attachments extends V2Resource<
  WorkItemAttachment,
  WorkItemAttachmentUploadRequest,
  WorkItemAttachmentConfirmRequest
> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/attachments/";
  protected operations: Record<string, OperationId> = {
    list: "attachments_list",
    retrieve: "attachments_retrieve",
    create: "attachments_create",
    update: "attachments_partial_update",
    delete: "attachments_destroy",
  };

  private pk(workItemId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { work_item_id: workItemId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemAttachmentField, "all"> & keyof WorkItemAttachment>(
    workItemId: string,
    params: ListWorkItemAttachmentsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemAttachment, F | "id">>>;
  list(workItemId: string, params?: ListWorkItemAttachmentsParams): Promise<Page<WorkItemAttachment>>;
  list(workItemId: string, params?: ListWorkItemAttachmentsParams): Promise<Page<WorkItemAttachment>> {
    return this.doList(this.pk(workItemId), params as Record<string, unknown>);
  }

  /** Every attachment, following pages automatically. */
  iterate(workItemId: string, params?: ListWorkItemAttachmentsParams): AsyncGenerator<WorkItemAttachment> {
    return this.doIterate(this.pk(workItemId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemAttachmentField, "all"> & keyof WorkItemAttachment>(
    workItemId: string,
    attachmentId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemAttachment, F | "id">>;
  retrieve(
    workItemId: string,
    attachmentId: string,
    params?: { fields?: readonly WorkItemAttachmentField[] }
  ): Promise<WorkItemAttachment>;
  retrieve(
    workItemId: string,
    attachmentId: string,
    params?: { fields?: readonly WorkItemAttachmentField[] }
  ): Promise<WorkItemAttachment> {
    return this.doRetrieve(this.pk(workItemId, attachmentId), params as Record<string, unknown>);
  }

  /** Step 1: get upload credentials. Follow up with `update(..., { is_uploaded: true })` once the bytes land. */
  create(
    workItemId: string,
    data: WorkItemAttachmentUploadRequest,
    params?: { fields?: readonly WorkItemAttachmentField[] }
  ): Promise<WorkItemAttachment> {
    return this.doCreate(data, this.pk(workItemId), params as Record<string, unknown>);
  }

  /** Step 2: confirm the upload. */
  update(
    workItemId: string,
    attachmentId: string,
    data: WorkItemAttachmentConfirmRequest,
    params?: { fields?: readonly WorkItemAttachmentField[] }
  ): Promise<WorkItemAttachment> {
    return this.doUpdate(data, this.pk(workItemId, attachmentId), params as Record<string, unknown>);
  }

  delete(workItemId: string, attachmentId: string): Promise<void> {
    return this.doDelete(this.pk(workItemId, attachmentId));
  }
}
