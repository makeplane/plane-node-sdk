/** A workspace-level release tag definition, distinct from a `Release`'s own `tag_id`. */
export interface ReleaseTag {
  id: string;
  commit_hash?: string | null;
  created_at?: string;
  created_by_id?: string | null;
  description?: string | null;
  git_tag?: string | null;
  version?: string;
}

/** POST body. `version` is required by the API. */
export interface CreateReleaseTag {
  version: string;
  commit_hash?: string | null;
  description?: string | null;
  git_tag?: string | null;
}

/** PATCH body — every field optional. */
export type UpdateReleaseTag = Partial<CreateReleaseTag>;
