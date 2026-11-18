import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { WorkspaceMember, ListMembersLiteParams, ProjectRoleDistribution } from "../models/Member";
import { PaginatedResponse } from "../models/common";
import { WorkspaceAssetDownload } from "../models/WorkspaceAsset";
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
   * Change a workspace member's role. `memberId` is the member's user id; `roleSlug` is a workspace role's slug,
   * such as "admin", "member" or "guest".
   */
  async updateMemberRole(workspaceSlug: string, memberId: string, roleSlug: string): Promise<WorkspaceMember> {
    return this.patch<WorkspaceMember>(`/workspaces/${workspaceSlug}/members/${memberId}/`, { role_slug: roleSlug });
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
   * Get a presigned download URL for a workspace asset.
   * Covers any uploaded asset in the workspace, including images embedded in work
   * item descriptions, which are not listed as work item attachments. The URL is
   * time-limited and needs no Plane auth to fetch.
   *
   * @param workspaceSlug - The workspace slug
   * @param assetId - UUID of the asset (the `src` of an `image-component` tag)
   */
  async getAsset(workspaceSlug: string, assetId: string): Promise<WorkspaceAssetDownload> {
    return this.get<WorkspaceAssetDownload>(`/workspaces/${workspaceSlug}/assets/${assetId}/`);
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
