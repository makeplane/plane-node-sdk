import { BaseModel } from "./common";

/**
 * ReleaseTag model interfaces
 * Tags are workspace-shared version identifiers (e.g. v2.3.0) that a release
 * can reference. Versions are unique per workspace.
 */
export interface ReleaseTag extends BaseModel {
  version: string;
  description?: string | null;
  commit_hash?: string | null;
  git_tag?: string | null;
  workspace: string;
}

export interface CreateReleaseTag {
  version: string;
  description?: string | null;
  commit_hash?: string | null;
  git_tag?: string | null;
}

export type UpdateReleaseTag = Partial<CreateReleaseTag>;

export interface ListReleaseTagsParams {
  per_page?: number;
  cursor?: string;
  [key: string]: any;
}
