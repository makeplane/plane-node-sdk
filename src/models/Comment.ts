import { AccessEnum } from "./common";

export interface WorkItemComment {
  id: string;
  is_member?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  comment_stripped?: string;
  comment_html?: string;
  attachments?: string[];
  access?: AccessEnum;
  external_source?: string;
  external_id?: string;
  edited_at?: string;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  issue?: string;
  actor?: string;
}

export interface WorkItemCommentCreateRequest {
  comment_json?: any;
  comment_html?: string;
  access?: AccessEnum;
  external_source?: string;
  external_id?: string;
}

export interface WorkItemCommentUpdateRequest {
  comment_json?: any;
  comment_html?: string;
  access?: AccessEnum;
  external_source?: string;
  external_id?: string;
}

export interface ListCommentsParams {
  issue?: string;
  project?: string;
  workspace?: string;
  limit?: number;
  offset?: number;
}
