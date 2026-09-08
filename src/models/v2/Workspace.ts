/**
 * A workspace. Read-only: `workspaces_create` and `workspaces_partial_update` were cut at
 * Gate A and do not exist in api_v2, so there are no Create/Update DTOs here.
 *
 * Every field except `id` is optional, like every other v2 read model — `?fields=` can
 * omit any of them.
 *
 * `slug` is the field that matters: it is what every child route addresses the workspace
 * by (`/workspaces/acme/projects/`), and the `{slug}` segment does not accept the UUID
 * `id`. See `Workspaces.rowId`.
 */
export interface Workspace {
  id: string;
  name?: string;
  slug?: string;
  logo_url?: string | null;
  organization_size?: string | null;
  owner_id?: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}
