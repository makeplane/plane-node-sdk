import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { WorkspaceMember } from "../models/Member";
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
