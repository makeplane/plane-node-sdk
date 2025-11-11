import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { Project } from "../../models/Project";
import { PaginatedResponse } from "../../models/common";
import { AddTeamspaceProjectsRequest, RemoveTeamspaceProjectsRequest } from "../../models/Teamspace";

/**
 * Teamspace Projects API resource
 * Handles teamspace project relationships
 */
export class Projects extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Get projects associated with a teamspace
   */
  async list(workspaceSlug: string, teamspaceId: string, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<Project>> {
    return this.get<PaginatedResponse<Project>>(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/projects/`, params);
  }

  /**
   * Add projects to a teamspace
   */
  async add(workspaceSlug: string, teamspaceId: string, addProjects: AddTeamspaceProjectsRequest): Promise<Project[]> {
    return this.post<Project[]>(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/projects/`, addProjects);
  }

  /**
   * Remove projects from a teamspace
   */
  async remove(workspaceSlug: string, teamspaceId: string, removeProjects: RemoveTeamspaceProjectsRequest): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/projects/`, removeProjects);
  }
}

