import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { Project } from "../../models/Project";
import { PaginatedResponse } from "../../models/common";
import { AddInitiativeProjectsRequest, RemoveInitiativeProjectsRequest } from "../../models/Initiative";

/**
 * Initiative Projects API resource
 * Handles initiative project relationships
 */
export class Projects extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Get projects associated with an initiative
   */
  async list(workspaceSlug: string, initiativeId: string, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<Project>> {
    return this.get<PaginatedResponse<Project>>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/projects/`, params);
  }

  /**
   * Add projects to an initiative
   */
  async add(workspaceSlug: string, initiativeId: string, addProjects: AddInitiativeProjectsRequest): Promise<Project[]> {
    return this.post<Project[]>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/projects/`, addProjects);
  }

  /**
   * Remove projects from an initiative
   */
  async remove(workspaceSlug: string, initiativeId: string, removeProjects: RemoveInitiativeProjectsRequest): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/projects/`, removeProjects);
  }
}

