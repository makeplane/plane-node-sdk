import { EffectivePermissions } from "../../models/v2/Permission";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/** The caller's effective permission grants at the workspace level, at `client.v2.workspace(slug).permissions`. */
export class WorkspacePermissions extends V2Resource<EffectivePermissions, never, never> {
  protected path = "/workspaces/{slug}/permissions/me/";
  protected operations: Record<string, AnyOperationId> = {
    me: "workspaces_permissions_me_retrieve",
  };

  /** The caller's effective permission grants at the workspace level. */
  async me(): Promise<EffectivePermissions> {
    return this.transport.request<EffectivePermissions>("GET", this.collectionUrl({}));
  }
}

/** The caller's effective permission grants for one project, at `client.v2.workspace(slug).project(project).permissions`. */
export class ProjectPermissions extends V2Resource<EffectivePermissions, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/permissions/me/";
  protected operations: Record<string, AnyOperationId> = {
    me: "workspaces_projects_permissions_me_retrieve",
  };

  /** The caller's effective permission grants for this project. */
  async me(): Promise<EffectivePermissions> {
    return this.transport.request<EffectivePermissions>("GET", this.collectionUrl({}));
  }
}
