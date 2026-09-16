export type ModuleStatus = "backlog" | "planned" | "in-progress" | "paused" | "completed" | "cancelled";

/** A project module. A work item may belong to several modules at once. */
export interface Module {
  id: string;
  name?: string;
  description?: string;
  status?: ModuleStatus;
  lead_id?: string | null;
  /** Members assigned to the module; not settable through this resource's write body. */
  member_ids?: string[];
  /** Format `date` (no time component), unlike {@link Cycle.start_date}'s `date-time`. */
  start_date?: string | null;
  /** Must not be earlier than `start_date`. */
  target_date?: string | null;
  sort_order?: number;
  /** Free-form icon/emoji payload; the golden gives it no fixed shape. */
  logo_props?: unknown;
  /** Non-null only once the module has been archived. */
  archived_at?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required by the API. */
export interface CreateModule {
  name: string;
  description?: string;
  status?: ModuleStatus;
  lead_id?: string | null;
  start_date?: string | null;
  /** Must not be earlier than `start_date`. */
  target_date?: string | null;
  sort_order?: number;
  logo_props?: unknown;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateModule = Partial<CreateModule>;
