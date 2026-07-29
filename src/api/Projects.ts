import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import {
  Project,
  CreateProject,
  UpdateProject,
  ListProjectsParams,
  ProjectLite,
  ListProjectsLiteParams,
} from "../models/Project";
import { PaginatedResponse } from "../models/common";
import { ProjectMember, ListMembersLiteParams } from "../models/Member";
import { ProjectFeatures, UpdateProjectFeatures } from "../models/ProjectFeatures";

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
   * List projects as a paginated "lite" response, intended for pickers and
   * reference lookups.
   */
  async listLite(workspaceSlug: string, params?: ListProjectsLiteParams): Promise<PaginatedResponse<ProjectLite>> {
    return this.get<PaginatedResponse<ProjectLite>>(`/workspaces/${workspaceSlug}/projects-lite/`, params);
  }

  /**
   * Get project members with their role information.
   */
  async getMembers(workspaceSlug: string, projectId: string): Promise<ProjectMember[]> {
    return this.get<ProjectMember[]>(`/workspaces/${workspaceSlug}/projects/${projectId}/project-members/`);
  }

  /**
   * List project members as a paginated "lite" response.
   * Unlike getMembers() (which returns a bare list), this returns a
   * cursor-paginated envelope.
   */
  async getMembersLite(
    workspaceSlug: string,
    projectId: string,
    params?: ListMembersLiteParams
  ): Promise<PaginatedResponse<ProjectMember>> {
    return this.get<PaginatedResponse<ProjectMember>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/project-members-lite/`,
      params
    );
  }

  /**
   * Get total work logs for a project
   */
  async getTotalWorkLogs(workspaceSlug: string, projectId: string): Promise<any> {
    return this.get<any>(`/workspaces/${workspaceSlug}/projects/${projectId}/total-worklogs/`);
  }

  /**
   * Retrieve project features
   */
  async retrieveFeatures(workspaceSlug: string, projectId: string): Promise<ProjectFeatures> {
    return this.get<ProjectFeatures>(`/workspaces/${workspaceSlug}/projects/${projectId}/features/`);
  }

  /**
   * Update project features
   */
  async updateFeatures(
    workspaceSlug: string,
    projectId: string,
    updateFeatures: UpdateProjectFeatures
  ): Promise<ProjectFeatures> {
    return this.patch<ProjectFeatures>(`/workspaces/${workspaceSlug}/projects/${projectId}/features/`, updateFeatures);
  }

  /**
   * Archive a project
   */
  async archive(workspaceSlug: string, projectId: string): Promise<void> {
    return this.post<void>(`/workspaces/${workspaceSlug}/projects/${projectId}/archive/`);
  }

  /**
   * Unarchive a project
   */
  async unArchive(workspaceSlug: string, projectId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/archive/`);
  }
}
