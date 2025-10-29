import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { Project, CreateProject, UpdateProject, ListProjectsParams } from "../models/Project";
import { PaginatedResponse } from "../models/common";
import { User } from "../models/User";

/**
 * Project API resource
 * Handles all project-related operations
 */
export class Projects extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new project
   */
  async create(workspaceSlug: string, createProject: CreateProject): Promise<Project> {
    if (!createProject.identifier) {
      createProject.identifier = createProject.name.toUpperCase().replace(/ /g, "").slice(0, 5);
    }

    return this.post<Project>(`/workspaces/${workspaceSlug}/projects/`, createProject);
  }

  /**
   * Retrieve a project by ID
   */
  async retrieve(workspaceSlug: string, projectId: string): Promise<Project> {
    return this.get<Project>(`/workspaces/${workspaceSlug}/projects/${projectId}/`);
  }

  /**
   * Update a project
   */
  async update(workspaceSlug: string, projectId: string, updateProject: UpdateProject): Promise<Project> {
    return this.patch<Project>(`/workspaces/${workspaceSlug}/projects/${projectId}/`, updateProject);
  }

  /**
   * Delete a project
   */
  async delete(workspaceSlug: string, projectId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/`);
  }

  /**
   * List projects with optional filtering
   */
  async list(workspaceSlug: string, params?: ListProjectsParams): Promise<PaginatedResponse<Project>> {
    return this.get<PaginatedResponse<Project>>(`/workspaces/${workspaceSlug}/projects/`, params);
  }

  /**
   * Get project members
   */
  async getMembers(workspaceSlug: string, projectId: string): Promise<User[]> {
    return this.get<User[]>(`/workspaces/${workspaceSlug}/projects/${projectId}/members/`);
  }

  /**
   * Get total work logs for a project
   */
  async getTotalWorkLogs(workspaceSlug: string, projectId: string): Promise<any> {
    return this.get<any>(`/workspaces/${workspaceSlug}/projects/${projectId}/work-logs/total/`);
  }
}
