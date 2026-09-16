/** A comment on a release. Every field except `id` is optional — see {@link Release}. */
export interface ReleaseComment {
  id: string;
  comment_html?: string | null;
  comment_id?: string;
  created_at?: string;
  created_by_id?: string | null;
  edited_at?: string | null;
  is_hidden?: boolean;
  is_resolved?: boolean;
  parent_id?: string | null;
  release_id?: string;
}

/** POST body. `comment_html` is required by the API. */
export interface CreateReleaseComment {
  comment_html: string;
  is_resolved?: boolean;
  parent_id?: string | null;
}

/** PATCH body — every field optional. */
export type UpdateReleaseComment = Partial<CreateReleaseComment>;
