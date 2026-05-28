import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkspaceProjectTemplate,
  UpdateWorkspaceProjectTemplate,
  WorkspaceProjectTemplate,
} from "../../models/WorkspaceTemplate";

/**
 * WorkspaceProjectTemplates sub-resource
 * Manages project templates at the workspace level
 */
export class Projects extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string): Promise<WorkspaceProjectTemplate[]> {
    const data = await this.get<WorkspaceProjectTemplate[] | { results: WorkspaceProjectTemplate[] }>(
      `/workspaces/${workspaceSlug}/projects/templates/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateWorkspaceProjectTemplate): Promise<WorkspaceProjectTemplate> {
    return this.post<WorkspaceProjectTemplate>(`/workspaces/${workspaceSlug}/projects/templates/`, data);
  }

  async update(
    workspaceSlug: string,
    templateId: string,
    data: UpdateWorkspaceProjectTemplate
  ): Promise<WorkspaceProjectTemplate> {
    return this.patch<WorkspaceProjectTemplate>(`/workspaces/${workspaceSlug}/projects/templates/${templateId}/`, data);
  }

  async del(workspaceSlug: string, templateId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/templates/${templateId}/`);
  }
}
