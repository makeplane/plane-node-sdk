/** Automation status: `draft` (being authored), `published` (live), or `disabled`. */
export type AutomationStatus = "draft" | "published" | "disabled";

/** An automation (api_v2) — a trigger/action/condition graph, scoped to one project or globally (`is_global`); `status`/`is_enabled` are owned by the `status` action. */
export interface Automation {
  id: string;
  bot_user_id?: string | null;
  created_at?: string;
  created_by_id?: string | null;
  current_version_id?: string | null;
  description?: string;
  is_enabled?: boolean;
  is_global?: boolean;
  last_run_at?: string | null;
  name?: string;
  project_ids?: string[];
  run_count?: number;
  scope?: string;
  status?: AutomationStatus;
  updated_at?: string;
}

/** POST body. `name`/`scope` required; `scope` is a free-form string (e.g. "WorkItem", "Cycle"), not an enum. */
export interface CreateAutomation {
  name: string;
  scope: string;
  description?: string;
  project_ids?: string[];
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateAutomation = Partial<CreateAutomation>;

/** POST body for the `status` action — the only way to flip `is_enabled`/`status`. */
export interface SetAutomationStatus {
  is_enabled: boolean;
}
