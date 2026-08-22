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
}
