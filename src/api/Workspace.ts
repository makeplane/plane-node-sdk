import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { UserLite } from "../models/schema-types";

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
  async getMembers(workspaceSlug: string): Promise<UserLite[]> {
    return this.get<UserLite[]>(`/workspaces/${workspaceSlug}/members/`);
  }
}
