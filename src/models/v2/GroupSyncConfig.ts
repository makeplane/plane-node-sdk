/** The workspace's IdP group-sync configuration — a singleton, GET/PATCH only at `/workspaces/{slug}/group-sync/config/`. */
export interface GroupSyncConfig {
  id: string;
  auto_remove?: boolean;
  default_workspace_role_slug?: string | null;
  group_attribute_key?: string;
  is_enabled?: boolean;
  sync_offline?: boolean;
  sync_on_login?: boolean;
}

/** PATCH body — every field optional. There is no create body; the config row is provisioned server-side. */
export interface UpdateGroupSyncConfig {
  auto_remove?: boolean;
  default_workspace_role_slug?: string | null;
  group_attribute_key?: string;
  is_enabled?: boolean;
  sync_offline?: boolean;
  sync_on_login?: boolean;
}
