/** `0` = private (owner and shared members), `1` = public (everyone in the workspace). */
export type DashboardAccess = 0 | 1;

/**
 * A PQL filter as stored on a dashboard or widget. Send `stripped`, the PQL query; it is the only
 * key charts and validation read. `json` is the web app's editor document: optional, stored as
 * sent. An unset filter reads back as `{ json: {}, stripped: "" }`; send that to clear one. Any
 * other key is stored as sent and ignored.
 */
export interface DashboardPqlFilters {
  stripped?: string;
  json?: Record<string, unknown>;
  [key: string]: unknown;
}

/** A workspace dashboard (api_v2). Every field except `id` is optional. */
export interface Dashboard {
  id: string;
  name?: string;
  /**
   * A {@link DashboardAccess} on every dashboard written today. Typed as `number` because older
   * dashboards can still carry the retired `2` ("shared"); writes accept only `0` or `1`.
   */
  access?: number;
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
  /** Defaults to `1` (public: the whole workspace can see it). Send `0` for a private dashboard. */
  access?: DashboardAccess;
  /** Projects in this workspace whose work items every widget reads. Duplicates are ignored. */
  project_ids?: string[];
  pql_filters?: DashboardPqlFilters;
  filters?: Record<string, unknown>;
  logo_props?: unknown;
}

/**
 * PATCH body — every field optional. `project_ids` replaces the whole list. v2 has no PUT.
 * Changing `access` needs the dashboard's owner, or a workspace admin when the dashboard is
 * public; sending the value it already has needs neither. Making a dashboard public removes its
 * shared members, so `is_shared` reads `false` afterwards.
 */
export type UpdateDashboard = Partial<CreateDashboard>;

/**
 * Body of `copy`: any create field, each one overriding the copied value and validated like a
 * create. The source's own values are copied as stored, so an older dashboard always copies.
 * `name` defaults to `"<source name> (Copy)"`, shortened to fit 255 characters; a source with the
 * retired `access` `2` copies as private.
 */
export type CopyDashboard = Partial<CreateDashboard>;
