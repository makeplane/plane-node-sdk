/** `0` (Secret) | `2` (Public) — the golden's `NetworkEnum`. There is deliberately no `1`. */
export type ProjectNetwork = 0 | 2;

/** `none` | `low` | `medium` | `high` | `urgent` — the golden's `PriorityEnum`, same values as a work item's. */
export type ProjectPriority = "none" | "low" | "medium" | "high" | "urgent";

/** An IANA timezone name (e.g. `"America/New_York"`, `"UTC"`); typed as `string`, not the golden's ~400-value enum. */
export type ProjectTimezone = string;

/** A project (api_v2). `identifier` is the project's short key (e.g. `ENG`), used as the work item prefix; every detail route accepts identifier or UUID. */
export interface Project {
  id: string;
  /** Months of inactivity before an issue auto-archives; `0`-`12`. */
  archive_in?: number;
  archived_at?: string | null;
  /** Months of inactivity before a project auto-closes; `0`-`12`. */
  close_in?: number;
  cover_image?: string | null;
  cover_image_url?: string | null;
  created_at?: string;
  created_by_id?: string | null;
  cycle_view?: boolean;
  default_assignee_id?: string | null;
  default_state_id?: string | null;
  description?: string;
  emoji?: string | null;
  estimate_id?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  guest_view_all_features?: boolean;
  icon_prop?: unknown;
  /** The short project key (e.g. `ENG`) — see this type's own doc comment. */
  identifier?: string;
  intake_view?: boolean;
  is_issue_type_enabled?: boolean;
  is_time_tracking_enabled?: boolean;
  issue_views_view?: boolean;
  logo_props?: unknown;
  module_view?: boolean;
  name?: string;
  network?: ProjectNetwork;
  page_view?: boolean;
  priority?: ProjectPriority;
  project_lead_id?: string | null;
  start_date?: string | null;
  state_id?: string | null;
  target_date?: string | null;
  timezone?: ProjectTimezone;
}

/** POST body. `identifier` and `name` are required by the API. */
export interface CreateProject {
  /** Short project key (e.g. `PROJ`); accepted length is deployment-specific, not the published `maxLength` (255) storage bound. */
  identifier: string;
  name: string;
  archive_in?: number;
  close_in?: number;
  cover_image?: string | null;
  cycle_view?: boolean;
  default_assignee_id?: string | null;
  /** Applied when the project already exists; the referenced state must exist first. */
  default_state_id?: string | null;
  description?: string;
  emoji?: string | null;
  /** Applied when the project already exists; the referenced estimate must exist first. */
  estimate_id?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  guest_view_all_features?: boolean;
  icon_prop?: unknown;
  intake_view?: boolean;
  is_issue_type_enabled?: boolean;
  is_time_tracking_enabled?: boolean;
  issue_views_view?: boolean;
  logo_props?: unknown;
  module_view?: boolean;
  network?: ProjectNetwork;
  page_view?: boolean;
  priority?: ProjectPriority;
  project_lead_id?: string | null;
  start_date?: string | null;
  state_id?: string | null;
  /** Must not be earlier than `start_date`. */
  target_date?: string | null;
  timezone?: ProjectTimezone;
}

/** PATCH body — every field optional, including `identifier`/`name`. v2 has no PUT. */
export type UpdateProject = Partial<CreateProject>;

/** `GET .../projects/{pk}/summary/` — identity plus optional per-resource counts. */
export interface ProjectSummary {
  id: string;
  identifier: string;
  name: string;
  /** Keyed by count name (`members`, `states`, `labels`, ...); `?counts=` narrows which keys are present. */
  counts: Record<string, number>;
}
