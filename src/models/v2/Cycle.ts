import { TimezoneEnum } from "../common";

/** A project cycle (sprint). A work item belongs to at most one cycle at a time. */
export interface Cycle {
  id: string;
  name?: string;
  description?: string;
  /** Must not be later than `end_date`. */
  start_date?: string | null;
  end_date?: string | null;
  timezone?: TimezoneEnum;
  sort_order?: number;
  owned_by_id?: string | null;
  /** Free-form icon/emoji payload; the golden gives it no fixed shape. */
  logo_props?: unknown;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required by the API; `owned_by_id` is server-assigned and not writable. */
export interface CreateCycle {
  name: string;
  description?: string;
  /** Must not be later than `end_date`. */
  start_date?: string | null;
  end_date?: string | null;
  timezone?: TimezoneEnum;
  sort_order?: number;
  logo_props?: unknown;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateCycle = Partial<CreateCycle>;
