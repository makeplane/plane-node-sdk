/** A workspace-level initiative label catalog entry (not the per-initiative association). */
export interface InitiativeLabel {
  id: string;
  name?: string;
  color?: string;
  description?: string;
  sort_order?: number;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required by the API. */
export interface CreateInitiativeLabel {
  name: string;
  color?: string;
  description?: string;
  sort_order?: number;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateInitiativeLabel = Partial<CreateInitiativeLabel>;
