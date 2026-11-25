/** The caller's effective permission grants at whatever scope (workspace or project) the call targeted. */
export interface EffectivePermissions {
  permission_grants: string[];
  /** The relation (e.g. a role slug) the grants were computed from, or `null`. */
  relation: string | null;
}

/** One key a scheme may grant, with what saving it also adds. */
export interface PermissionKey {
  permission: string;
  requires: string[];
  /** Added with the same condition as the key. */
  includes: string[];
}

/** `permissions/resources/`: the keys a scheme of one namespace may grant, per resource. */
export interface PermissionCatalogue {
  resources: { resource_type: string; permissions: PermissionKey[] }[];
}
