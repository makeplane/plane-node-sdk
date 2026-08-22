export type StateGroup = "backlog" | "unstarted" | "started" | "completed" | "cancelled" | "triage";

/** A project state. Every field except `id` is optional. */
export interface State {
  id: string;
  name?: string;
  color?: string;
  description?: string;
  group?: StateGroup;
  is_default?: boolean;
  is_triage?: boolean;
  sequence?: number;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` and `color` are required by the API. */
export interface CreateState {
  name: string;
  color: string;
  description?: string;
  group?: StateGroup;
  is_default?: boolean;
  sequence?: number;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateState = Partial<CreateState>;
