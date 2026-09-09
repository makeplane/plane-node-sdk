/** `InitiativeStateEnum` in the golden. */
export type InitiativeState = "DRAFT" | "PLANNED" | "ACTIVE" | "COMPLETED" | "CLOSED";

/** A workspace initiative. Every field except `id` is optional. */
export interface Initiative {
  id: string;
  name?: string;
  description?: string | null;
  /** Only present when `fields` names it explicitly — deferred on list. */
  description_html?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  state?: InitiativeState;
  lead_id?: string | null;
  logo_props?: unknown;
  label_ids?: string[];
  project_ids?: string[];
  archived_at?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required; `project_ids` is a full-replace write (see `Initiatives.projects.add`/`.remove` for incremental changes). */
export interface CreateInitiative {
  name: string;
  description?: string | null;
  description_html?: string | null;
  start_date?: string | null;
  /** Must not be earlier than `start_date`. */
  end_date?: string | null;
  state?: InitiativeState;
  lead_id?: string | null;
  logo_props?: unknown;
  project_ids?: string[];
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateInitiative = Partial<CreateInitiative>;
