/** A workspace-level release label definition, distinct from a `Release`'s own `label_ids`. */
export interface ReleaseLabel {
  id: string;
  color?: string;
  created_at?: string;
  created_by_id?: string | null;
  name?: string;
  sort_order?: number;
}

/** POST body. `name` is required by the API. */
export interface CreateReleaseLabel {
  name: string;
  color?: string;
  sort_order?: number;
}

/** PATCH body — every field optional. */
export type UpdateReleaseLabel = Partial<CreateReleaseLabel>;
