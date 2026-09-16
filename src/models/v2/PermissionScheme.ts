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
}
