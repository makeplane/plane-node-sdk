/** A teamspace — a named group of members and projects (workspace-scoped). `?expand=lead` replaces `lead_id` with the full object. */
export interface Teamspace {
  id: string;
  name?: string;
  description_html?: string;
  lead_id?: string | null;
  logo_props?: unknown | null;
  member_ids?: string[];
  project_ids?: string[];
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required by the API. */
export interface CreateTeamspace {
  name: string;
  description_html?: string;
  lead_id?: string | null;
  logo_props?: unknown | null;
  member_ids?: string[];
  project_ids?: string[];
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateTeamspace = Partial<CreateTeamspace>;
