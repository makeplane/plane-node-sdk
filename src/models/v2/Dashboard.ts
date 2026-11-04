/** `0` = private (owner and shared members), `1` = public (everyone in the workspace). */
export type DashboardAccess = 0 | 1;

/**
 * A PQL filter as stored on a dashboard or widget. Send `raw`/`stripped`; an unset filter
 * reads back as `{ json: {}, stripped: "" }`.
 */
export interface DashboardPqlFilters {
  raw?: string;
  stripped?: string;
  json?: Record<string, unknown>;
}

/** A workspace dashboard (api_v2). Every field except `id` is optional. */
export interface Dashboard {
  id: string;
  name?: string;
  access?: DashboardAccess;
  project_ids?: string[];
  pql_filters?: DashboardPqlFilters;
  /** Filter object applied to every widget, e.g. `{ priority__in: "urgent" }`. */
  filters?: Record<string, unknown>;
  logo_props?: unknown;
  /** `true` when shared with at least one member. */
  is_shared?: boolean;
  /** `true` while a public link is active. */
  is_published?: boolean;
  archived_at?: string | null;
  owned_by_id?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by_id?: string | null;
  updated_by_id?: string | null;
}

/** POST body. `name` is required by the API. */
export interface CreateDashboard {
  name: string;
  access?: DashboardAccess;
  /** Projects in this workspace whose work items every widget reads. Duplicates are ignored. */
  project_ids?: string[];
  pql_filters?: DashboardPqlFilters;
  filters?: Record<string, unknown>;
  logo_props?: unknown;
}

/**
 * PATCH body — every field optional. `project_ids` replaces the whole list. v2 has no PUT.
 * Changing `access` needs the dashboard's owner; sending the value it already has does not.
 */
export type UpdateDashboard = Partial<CreateDashboard>;

/** Body of `copy`: any create field, each one overriding the copied value. `name` defaults to `"<source name> (Copy)"`. */
export type CopyDashboard = Partial<CreateDashboard>;
