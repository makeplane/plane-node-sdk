/** A personal sticky note (workspace-scoped, per-caller via `owner_id`). Every field except `id` is optional. */
export interface Sticky {
  id: string;
  name?: string | null;
  color?: string | null;
  background_color?: string | null;
  description_html?: string;
  description_stripped?: string | null;
  logo_props?: unknown;
  sort_order?: number;
  owner_id?: string;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. Every field is optional — an empty body creates a blank sticky. */
export interface CreateSticky {
  name?: string | null;
  color?: string | null;
  background_color?: string | null;
  description_html?: string;
  logo_props?: unknown;
  sort_order?: number;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateSticky = Partial<CreateSticky>;
