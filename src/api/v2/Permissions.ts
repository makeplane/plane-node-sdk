import { EffectivePermissions, PermissionCatalogue } from "../../models/v2/Permission";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/**
 * The caller's own effective grants for a workspace.
 *
 * A **singleton**: the row *is* the collection (`/workspaces/{slug}/permissions/me/`,
 * no primary key of its own), so it reads through the kernel's singleton helper rather
 * than `doRetrieve`, which would append a pk segment and request a URL that does not
 * exist.
 */
export class WorkspacePermissions extends V2Resource<EffectivePermissions, never, never> {
  protected path = "/workspaces/{slug}/permissions/me/";
  protected operations: Record<string, AnyOperationId> = {
    me: "workspaces_permissions_me_retrieve",
    resources: "workspaces_permissions_resources_retrieve",
  };
  protected extraPaths: Record<string, string> = { resources: "/workspaces/{slug}/permissions/resources/" };

  /** The caller's effective permission grants across the whole workspace. */
  me(slug: string): Promise<EffectivePermissions> {
    return this.doRetrieveSingleton<EffectivePermissions>({ slug }, "me");
  }

  /** The keys a custom scheme of `namespace` (default `workspace`) may grant, with what each requires. */
  resources(slug: string, params?: { namespace?: "workspace" | "project" }): Promise<PermissionCatalogue> {
    return this.doRetrieveSingleton<PermissionCatalogue>({ slug }, "resources", params);
  }
}

/** The caller's own effective grants for one project — the project-scoped twin of {@link WorkspacePermissions}, and a singleton for the same reason. */
export class ProjectPermissions extends V2Resource<EffectivePermissions, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/permissions/me/";
  protected operations: Record<string, AnyOperationId> = {
    me: "workspaces_projects_permissions_me_retrieve",
  };

  /** The caller's effective permission grants scoped to this project. */
  me(slug: string, project: string): Promise<EffectivePermissions> {
    return this.doRetrieveSingleton<EffectivePermissions>({ slug, project_id: project }, "me");
  }
}
