import { Configuration } from "../Configuration";
import { Epic, CreateEpic, UpdateEpic, AddEpicWorkItems, EpicIssue } from "../models/Epic";
import { PaginatedResponse } from "../models/common";
import { BaseResource } from "./BaseResource";

/**
 * Epics API resource
 * Handles all epic-related operations
 */
export class Epics extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new epic in the specified project
   */
  async create(workspaceSlug: string, projectId: string, data: CreateEpic): Promise<Epic> {
    return this.post<Epic>(`/workspaces/${workspaceSlug}/projects/${projectId}/epics/`, data);
  }

  /**
   * Retrieve an epic by ID
   */
  async retrieve(workspaceSlug: string, projectId: string, epicId: string): Promise<Epic> {
    return this.get<Epic>(`/workspaces/${workspaceSlug}/projects/${projectId}/epics/${epicId}/`);
  }

  /**
   * Partially update an existing epic
   */
  async update(workspaceSlug: string, projectId: string, epicId: string, data: UpdateEpic): Promise<Epic> {
    return this.patch<Epic>(`/workspaces/${workspaceSlug}/projects/${projectId}/epics/${epicId}/`, data);
  }

  /**
   * Delete an epic
   */
  async delete(workspaceSlug: string, projectId: string, epicId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/epics/${epicId}/`);
  }

  /**
   * List epics with optional filtering
   */
  async list(workspaceSlug: string, projectId: string, params?: any): Promise<PaginatedResponse<Epic>> {
    return this.get<PaginatedResponse<Epic>>(`/workspaces/${workspaceSlug}/projects/${projectId}/epics/`, params);
  }

  /**
   * List work items under an epic
   */
  async listIssues(
    workspaceSlug: string,
    projectId: string,
    epicId: string,
    params?: any
  ): Promise<PaginatedResponse<EpicIssue>> {
    return this.get<PaginatedResponse<EpicIssue>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/epics/${epicId}/issues/`,
      params
    );
  }

  /**
   * Add work items as sub-issues under an epic
   */
  async addIssues(
    workspaceSlug: string,
    projectId: string,
    epicId: string,
    data: AddEpicWorkItems
  ): Promise<EpicIssue[]> {
    return this.post<EpicIssue[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/epics/${epicId}/issues/`,
      data
    );
  }
}
