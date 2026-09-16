/** A project milestone. Unlike `Cycle`/`Module`, its display field is `title`, not `name`. */
export interface Milestone {
  id: string;
  title?: string;
  target_date?: string | null;
  /** Non-null only once the milestone has been archived. */
  archived_at?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `title` is required by the API. */
export interface CreateMilestone {
  title: string;
  target_date?: string | null;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateMilestone = Partial<CreateMilestone>;
