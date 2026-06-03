import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkspacePageTemplate,
  UpdateWorkspacePageTemplate,
  WorkspacePageTemplate,
} from "../../models/WorkspaceTemplate";

/**
 * WorkspacePageTemplates sub-resource
 * Manages page templates at the workspace level
 */
export class Pages extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string): Promise<WorkspacePageTemplate[]> {
    const data = await this.get<WorkspacePageTemplate[] | { results: WorkspacePageTemplate[] }>(
      `/workspaces/${workspaceSlug}/pages/templates/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateWorkspacePageTemplate): Promise<WorkspacePageTemplate> {
    return this.post<WorkspacePageTemplate>(`/workspaces/${workspaceSlug}/pages/templates/`, data);
  }

  async update(
    workspaceSlug: string,
    templateId: string,
    data: UpdateWorkspacePageTemplate
  ): Promise<WorkspacePageTemplate> {
    return this.patch<WorkspacePageTemplate>(`/workspaces/${workspaceSlug}/pages/templates/${templateId}/`, data);
  }

  async del(workspaceSlug: string, templateId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/pages/templates/${templateId}/`);
  }
}
