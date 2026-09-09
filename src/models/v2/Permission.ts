/** The caller's effective permission grants at whatever scope (workspace or project) the call targeted. */
export interface EffectivePermissions {
  permission_grants: string[];
  /** The relation (e.g. a role slug) the grants were computed from, or `null`. */
  relation: string | null;
}
