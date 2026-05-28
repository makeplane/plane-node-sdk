import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreatePageTemplate, PageTemplate, UpdatePageTemplate } from "../../models/ProjectTemplate";

/**
 * ProjectPageTemplates sub-resource
 * Manages page templates within a project
 */
export class Pages extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List all page templates for a project
   */
  async list(workspaceSlug: string, projectId: string): Promise<PageTemplate[]> {
    const data = await this.get<PageTemplate[] | { results: PageTemplate[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/pages/templates/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Create a new page template for a project
   */
  async create(workspaceSlug: string, projectId: string, data: CreatePageTemplate): Promise<PageTemplate> {
    return this.post<PageTemplate>(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/templates/`, data);
  }

  /**
   * Update a page template by ID
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    templateId: string,
    data: UpdatePageTemplate
  ): Promise<PageTemplate> {
    return this.patch<PageTemplate>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/pages/templates/${templateId}/`,
      data
    );
  }

  /**
   * Delete a page template by ID
   */
  async del(workspaceSlug: string, projectId: string, templateId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/templates/${templateId}/`);
  }
}
