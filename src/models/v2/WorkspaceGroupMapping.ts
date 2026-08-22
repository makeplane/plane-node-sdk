/** An IdP group -> workspace role mapping (group-sync). Members of `idp_group_name` get `role_slug` at the workspace level. */
export interface WorkspaceGroupMapping {
  id: string;
  created_at?: string;
  idp_group_name?: string;
  role_slug?: string | null;
}

/** POST body. `idp_group_name` and `role_slug` are required by the API. */
export interface CreateWorkspaceGroupMapping {
  idp_group_name: string;
  role_slug: string;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateWorkspaceGroupMapping = Partial<CreateWorkspaceGroupMapping>;
