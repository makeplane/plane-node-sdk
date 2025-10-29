/**
 * Attachment model interfaces
 *
 */

export interface ListAttachmentsParams {
  issue?: string;
  project?: string;
  workspace?: string;
  limit?: number;
  offset?: number;
}

export interface WorkItemAttachment {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  attributes?: any;
  asset: string;
  entity_type?: string;
  entity_identifier?: string;
  is_deleted?: boolean;
  is_archived?: boolean;
  external_id?: string;
  external_source?: string;
  size?: number;
  is_uploaded?: boolean;
  storage_metadata?: any;
  created_by?: string;
  updated_by?: string;
  user?: string;
  workspace?: string;
  draft_issue?: string;
  project?: string;
  issue?: string;
  comment?: string;
  page?: string;
}

export interface WorkItemAttachmentUploadRequest {
  name: string; // Original filename of the asset
  type?: string; // MIME type of the file
  size: number; // File size in bytes
  external_id?: string; // External identifier for the asset (for integration tracking)
  external_source?: string; // External source system (for integration tracking)
}

export type UpdateWorkItemAttachmentRequest = Partial<WorkItemAttachment>;
