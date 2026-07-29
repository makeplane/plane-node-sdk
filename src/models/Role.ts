/**
 * Role model interfaces
 *
 * Roles are defined at the workspace level. namespace "workspace" covers
 * workspace-level roles (Owner / Admin / Member / Guest); namespace "project"
 * covers the project-role definitions shared by every project in the workspace
 * (Admin / Contributor / Commenter / Guest).
 */

export type RoleNamespace = "workspace" | "project";

export interface Role {
  id?: string;
  name?: string;
  /**
   * Stable identifier to use in code. Not globally unique — e.g. "admin" and
   * "guest" exist in both namespaces — so key roles by (namespace, slug).
   */
  slug?: string;
  namespace?: RoleNamespace | string;
  level?: number;
  is_system?: boolean;
  [key: string]: unknown;
}

export interface ListRolesParams {
  /** Filter by namespace. When omitted, both are returned. */
  namespace?: RoleNamespace;
  /** Number of results per page (server default 20) */
  per_page?: number;
  /** Pagination cursor from a previous response's next_cursor */
  cursor?: string;
}
