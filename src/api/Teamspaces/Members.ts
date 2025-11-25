import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { User } from "../../models/User";
import { PaginatedResponse } from "../../models/common";
import { AddTeamspaceMembersRequest, RemoveTeamspaceMembersRequest } from "../../models/Teamspace";

/**
 * Teamspace Members API resource
 * Handles teamspace member relationships
 */
export class Members extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Get members associated with a teamspace
   */
  async list(workspaceSlug: string, teamspaceId: string, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/members/`, params);
  }

  /**
   * Add members to a teamspace
   */
  async add(workspaceSlug: string, teamspaceId: string, addMembers: AddTeamspaceMembersRequest): Promise<User[]> {
    return this.post<User[]>(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/members/`, addMembers);
  }

  /**
   * Remove members from a teamspace
   */
  async remove(workspaceSlug: string, teamspaceId: string, removeMembers: RemoveTeamspaceMembersRequest): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/members/`, removeMembers);
  }
}

