/**
 * State model interfaces
 */

export type State = {
  id: string;
  name: string;
  description?: string;
  color: string;
  sequence?: number;
  group?: GroupEnum;
  is_triage?: boolean;
  default?: boolean;
  project?: string;
  workspace?: string;
  external_source?: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
};

export type CreateState = {
  name: string;
  description?: string;
  color: string;
  sequence?: number;
  group?: GroupEnum;
  is_triage?: boolean;
  default?: boolean;
  external_source?: string;
  external_id?: string;
};

export type UpdateState = Partial<CreateState>;

export type ListStatesParams = {
  project?: string;
  limit?: number;
  offset?: number;
};

export type GroupEnum = "backlog" | "unstarted" | "started" | "completed" | "cancelled" | "triage";

/**
 * Workspace (catalog) states accept only the five lifecycle groups — the
 * triage state is system-managed under workspace governance.
 */
export type CatalogGroupEnum = "backlog" | "unstarted" | "started" | "completed" | "cancelled";

/**
 * Request model for creating a workspace (catalog) state.
 *
 * Only accepted when the workspace owns states and workflows (workspace
 * governance). `group` is required and must be one of the five lifecycle
 * groups. Catalog states carry no `default` flag; the workspace default lives
 * on the workflow's default state.
 */
export type CreateWorkspaceState = {
  name: string;
  color: string;
  group: CatalogGroupEnum;
  description?: string;
  external_source?: string;
  external_id?: string;
};

/**
 * Request model for updating a workspace (catalog) state.
 * `default` is not accepted for catalog states — the API rejects it with
 * code `workspace_managed`.
 */
export type UpdateWorkspaceState = Partial<CreateWorkspaceState>;

export type ListWorkspaceStatesParams = {
  cursor?: string;
  per_page?: number;
};
