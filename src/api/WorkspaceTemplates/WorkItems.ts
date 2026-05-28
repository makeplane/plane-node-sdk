import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkspaceWorkItemTemplate,
  UpdateWorkspaceWorkItemTemplate,
  WorkspaceWorkItemTemplate,
} from "../../models/WorkspaceTemplate";

/**
 * WorkspaceWorkItemTemplates sub-resource
 * Manages work item templates at the workspace level
 */
export class WorkItems extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string): Promise<WorkspaceWorkItemTemplate[]> {
    const data = await this.get<WorkspaceWorkItemTemplate[] | { results: WorkspaceWorkItemTemplate[] }>(
      `/workspaces/${workspaceSlug}/workitems/templates/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateWorkspaceWorkItemTemplate): Promise<WorkspaceWorkItemTemplate> {
    return this.post<WorkspaceWorkItemTemplate>(`/workspaces/${workspaceSlug}/workitems/templates/`, data);
  }

  async update(
    workspaceSlug: string,
    templateId: string,
    data: UpdateWorkspaceWorkItemTemplate
  ): Promise<WorkspaceWorkItemTemplate> {
    return this.patch<WorkspaceWorkItemTemplate>(
      `/workspaces/${workspaceSlug}/workitems/templates/${templateId}/`,
      data
    );
  }

  async del(workspaceSlug: string, templateId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/workitems/templates/${templateId}/`);
  }
}
