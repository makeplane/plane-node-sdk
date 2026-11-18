/** The golden's `NamespaceEnum` — which level this role's permissions apply at. */
export type RoleNamespace = "instance" | "workspace" | "project";

/** The golden's `RoleStatusEnum`. */
export type RoleStatus = "active" | "inactive";

/** A permission role (system-seeded or workspace-defined). Read-only — no create/update/delete. */
export interface Role {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  level?: number;
  namespace?: RoleNamespace;
  status?: RoleStatus;
  is_system?: boolean;
  sort_order?: number;
  based_on_id?: string | null;
  permission_scheme_ids?: string[];
  /** Everything the role grants: a system role's set, or the union of a custom role's schemes. */
  permissions?: string[];
  updated_at?: string;
}

/** POST body for `roles_create`. Custom roles only. */
export interface CreateRole {
  name: string;
  namespace: Exclude<RoleNamespace, "instance">;
  description?: string;
  permission_scheme_ids?: string[];
  /** Clone this role's schemes (e.g. `"member"`) when no `permission_scheme_ids` are given. */
  based_on_slug?: string;
  level?: number;
  sort_order?: number;
  status?: RoleStatus;
}

/** PATCH body for `roles_partial_update`. A system role takes `sort_order` only. */
export interface UpdateRole {
  name?: string;
  description?: string;
  permission_scheme_ids?: string[];
  level?: number;
  sort_order?: number;
  status?: RoleStatus;
  /** Required when disabling a role that people or pending invites hold: the role they move to. */
  reassign_to?: string;
}
