import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { WorkspaceMember, ListMembersLiteParams, ProjectRoleDistribution } from "../models/Member";
import { PaginatedResponse } from "../models/common";
import { UpdateWorkspaceFeatures, WorkspaceFeatures } from "../models/WorkspaceFeatures";

/**
 * Workspace API resource
 * Handles all workspace-related operations
 */
export class Workspace extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Get workspace members with their role information.
   */
  async getMembers(workspaceSlug: string): Promise<WorkspaceMember[]> {
    return this.get<WorkspaceMember[]>(`/workspaces/${workspaceSlug}/members/`);
  }

  /**
   * List workspace members as a paginated "lite" response.
   * Unlike getMembers() (which returns a bare list), this returns a
   * cursor-paginated envelope.
   */
  async getMembersLite(
    workspaceSlug: string,
    params?: ListMembersLiteParams
  ): Promise<PaginatedResponse<WorkspaceMember>> {
    return this.get<PaginatedResponse<WorkspaceMember>>(`/workspaces/${workspaceSlug}/members-lite/`, params);
  }

  /**
   * Aggregate count of project members by role across the workspace.
   * Counts span all active (non-archived) projects and include both built-in
   * and custom roles.
   */
  async getProjectRoleDistribution(workspaceSlug: string): Promise<ProjectRoleDistribution> {
    return this.get<ProjectRoleDistribution>(`/workspaces/${workspaceSlug}/project-role-distribution/`);
  }

  /**
   * Retrieve workspace features
   */
  async retrieveFeatures(workspaceSlug: string): Promise<WorkspaceFeatures> {
    return this.get<WorkspaceFeatures>(`/workspaces/${workspaceSlug}/features/`);
  }

  /**
   * Update workspace features
   */
  async updateFeatures(workspaceSlug: string, updateFeatures: UpdateWorkspaceFeatures): Promise<WorkspaceFeatures> {
    return this.patch<WorkspaceFeatures>(`/workspaces/${workspaceSlug}/features/`, updateFeatures);
  }
}
