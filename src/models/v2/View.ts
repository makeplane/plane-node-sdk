/** `0` (Private) | `1` (Public) — the golden's `IssueViewAccessEnum`. */
export type ViewAccess = 0 | 1;

/** A saved work-item view (filters + layout) — the golden's `IssueView`. Project- and workspace-scoped flavors share the same row shape. */
export interface View {
  id: string;
  access?: ViewAccess;
  archived_at?: string | null;
  created_at?: string;
  created_by_id?: string | null;
  description?: string;
  display_filters?: unknown;
  display_properties?: unknown;
  filters?: unknown;
  is_locked?: boolean;
  logo_props?: unknown;
  name?: string;
  owned_by_id?: string;
  pql_filters?: unknown;
  query?: unknown;
  sort_order?: number;
}

/** POST body. `name` is required by the API. */
export interface CreateView {
  name: string;
  access?: ViewAccess;
  description?: string;
  display_filters?: unknown;
  display_properties?: unknown;
  filters?: unknown;
  is_locked?: boolean;
  logo_props?: unknown;
  pql_filters?: unknown;
  sort_order?: number;
}

/** PATCH body — every field optional, including `name`. v2 has no PUT. */
export type UpdateView = Partial<CreateView>;
