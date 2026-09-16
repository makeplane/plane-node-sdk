/** `0` = Public, `1` = Private. Shared by wiki pages and collections. */
export type PageAccess = 0 | 1;

/** `type` filter accepted by the wiki pages list endpoints (project- and workspace-scoped). */
export type PageTypeFilter = "all" | "archived" | "private" | "public" | "shared";

/** A wiki page (api_v2) — golden schema name; consumers alias the import (`import { Page as WikiPage }`) to avoid clashing with `Page<T>`. */
export interface Page {
  id: string;
  access?: PageAccess;
  archived_at?: string | null;
  collection_id?: string | null;
  color?: string;
  created_at?: string;
  created_by_id?: string | null;
  description_html?: string;
  description_stripped?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  is_global?: boolean;
  is_locked?: boolean;
  logo_props?: unknown;
  name?: string;
  owned_by_id?: string;
  parent_id?: string | null;
  sort_order?: number;
  view_props?: unknown;
}

/** POST body. `name` is required by the API. */
export interface CreatePage {
  name: string;
  access?: PageAccess;
  archived_at?: string | null;
  /** Which collection the page is filed in; omit for public pages (defaults to "General"), required for private ones. */
  collection_id?: string | null;
  color?: string;
  description_html?: string;
  external_id?: string | null;
  external_source?: string | null;
  is_locked?: boolean;
  logo_props?: unknown;
  parent_id?: string | null;
  sort_order?: number;
  view_props?: unknown;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdatePage = Partial<CreatePage>;
