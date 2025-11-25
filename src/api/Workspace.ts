import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { User } from "../models/User";
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
   * Get workspace members
   */
  async getMembers(workspaceSlug: string): Promise<User[]> {
    return this.get<User[]>(`/workspaces/${workspaceSlug}/members/`);
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
