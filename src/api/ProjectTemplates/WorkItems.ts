import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateWorkItemTemplate, UpdateWorkItemTemplate, WorkItemTemplate } from "../../models/ProjectTemplate";

/**
 * ProjectWorkItemTemplates sub-resource
 * Manages work item templates within a project
 */
export class WorkItems extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List all work item templates for a project
   */
  async list(workspaceSlug: string, projectId: string): Promise<WorkItemTemplate[]> {
    const data = await this.get<WorkItemTemplate[] | { results: WorkItemTemplate[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workitems/templates/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Create a new work item template for a project
   */
  async create(workspaceSlug: string, projectId: string, data: CreateWorkItemTemplate): Promise<WorkItemTemplate> {
    return this.post<WorkItemTemplate>(`/workspaces/${workspaceSlug}/projects/${projectId}/workitems/templates/`, data);
  }

  /**
   * Update a work item template by ID
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    templateId: string,
    data: UpdateWorkItemTemplate
  ): Promise<WorkItemTemplate> {
    return this.patch<WorkItemTemplate>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workitems/templates/${templateId}/`,
      data
    );
  }

  /**
   * Delete a work item template by ID
   */
  async del(workspaceSlug: string, projectId: string, templateId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/workitems/templates/${templateId}/`);
  }
}
