import { BaseModel } from "./common";
import { ReleaseDescription } from "./Release";

/**
 * ReleaseComment model interfaces
 * Comments are attached to a specific release. The comment body is written
 * through `comment_html` and read back as a nested `comment` description.
 */
export interface ReleaseComment extends BaseModel {
  release: string;
  comment?: ReleaseDescription;
  parent?: string | null;
  edited_at?: string | null;
  is_resolved: boolean;
  is_hidden: boolean;
  hidden_reason?: string | null;
  hidden_at?: string | null;
  hidden_by?: string | null;
  workspace: string;
}

export interface CreateReleaseComment {
  comment_html?: string;
  parent?: string | null;
  is_resolved?: boolean;
}

export type UpdateReleaseComment = Partial<CreateReleaseComment>;

export interface ListReleaseCommentsParams {
  per_page?: number;
  cursor?: string;
  [key: string]: any;
}
