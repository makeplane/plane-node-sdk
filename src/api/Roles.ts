import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";
import { Role, ListRolesParams } from "../models/Role";

/**
 * Roles API resource
 * Read-only access to workspace and project role definitions.
 *
 * Roles are defined at the workspace level. The project-role definitions are
 * shared by every project in the workspace — there is no per-project roles
 * endpoint, so this resource takes no project id.
 */
export class Roles extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List role definitions in a workspace.
   * Filter with params.namespace ("workspace" | "project"); when omitted,
   * both are returned, ordered by namespace, sort order, then name.
   */
  async list(workspaceSlug: string, params?: ListRolesParams): Promise<PaginatedResponse<Role>> {
    return this.get<PaginatedResponse<Role>>(`/workspaces/${workspaceSlug}/roles/`, params);
  }

  /**
   * Retrieve a single role definition by id
   */
  async retrieve(workspaceSlug: string, roleId: string): Promise<Role> {
    return this.get<Role>(`/workspaces/${workspaceSlug}/roles/${roleId}/`);
  }
}
