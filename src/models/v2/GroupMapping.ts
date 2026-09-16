/** An IdP group -> project(s) + role mapping (group-sync). Members of `idp_group_name` get `role_slug` on the mapped project, or every project when `all_projects` is set. */
export interface GroupMapping {
  id: string;
  /** When true, the mapping applies to every project in the workspace and `project_id` is null. */
  all_projects?: boolean;
  created_at?: string;
  idp_group_name?: string;
  project_id?: string | null;
  role_slug?: string | null;
}

/** POST body. `idp_group_name` and `role_slug` are required by the API. */
export interface CreateGroupMapping {
  idp_group_name: string;
  role_slug: string;
  /** Defaults to `false`. When `true`, `project_id` is ignored server-side. */
  all_projects?: boolean;
  project_id?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateGroupMapping = Partial<CreateGroupMapping>;
