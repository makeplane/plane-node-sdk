import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { User } from "../models/User";

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
}
