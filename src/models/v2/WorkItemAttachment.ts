/** A work item attachment. Two-step upload: `create` returns credentials, then `update` marks `is_uploaded: true`. */
export interface WorkItemAttachment {
  id: string;
  asset_url?: string | null;
  attributes?: unknown;
  content_type?: string | null;
  created_at?: string;
  created_by_id?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  is_uploaded?: boolean;
  name?: string | null;
  size?: number;
  work_item_id?: string | null;
}

/** POST body for the upload-credential step (create). `name`/`size` are required. */
export interface WorkItemAttachmentUploadRequest {
  name: string;
  size: number;
  external_id?: string | null;
  external_source?: string | null;
  /** Defaults to `application/octet-stream`. */
  type?: string;
}

/** PATCH body for the confirm-upload step — marks `is_uploaded`. Unrelated in shape to the create body. */
export interface WorkItemAttachmentConfirmRequest {
  is_uploaded?: boolean;
}
