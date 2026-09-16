/** A link attached to a release. Every field except `id` is optional — see {@link Release}. */
export interface ReleaseLink {
  id: string;
  created_at?: string;
  created_by_id?: string | null;
  metadata?: unknown;
  release_id?: string;
  title?: string;
  url?: string;
}

/** POST body. `title` and `url` are required by the API. */
export interface CreateReleaseLink {
  title: string;
  url: string;
  metadata?: unknown;
}

/** PATCH body — every field optional. */
export type UpdateReleaseLink = Partial<CreateReleaseLink>;
