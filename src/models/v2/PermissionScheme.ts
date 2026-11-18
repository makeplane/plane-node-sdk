export type PermissionSchemeNamespace = "instance" | "workspace" | "project";

/** A permission scheme — system-defined or custom — bundling permission strings (e.g. `workitem:edit`). Read-only in api_v2. */
export interface PermissionScheme {
  id: string;
  name?: string;
  description?: string;
  namespace?: PermissionSchemeNamespace;
  is_system?: boolean;
  permissions?: string[];
  slug?: string;
  sort_order?: number;
  updated_at?: string;
}

/** POST body for `permission_schemes_create`. The server adds the permissions these need. */
export interface CreatePermissionScheme {
  name: string;
  namespace: Exclude<PermissionSchemeNamespace, "instance">;
  description?: string;
  permissions?: string[];
  sort_order?: number;
}

/** PATCH body for `permission_schemes_partial_update`; `permissions` replaces the list. */
export type UpdatePermissionScheme = Partial<Omit<CreatePermissionScheme, "namespace">>;

/** What a change to a scheme reaches: this workspace's roles composing it, their people and projects. */
export interface PermissionSchemeImpact {
  roles: number;
  users: number;
  projects: number;
}
