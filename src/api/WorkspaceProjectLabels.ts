import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import {
  CreateWorkspaceProjectLabel,
  UpdateWorkspaceProjectLabel,
  WorkspaceProjectLabel,
} from "../models/WorkspaceProjectLabel";

/**
 * WorkspaceProjectLabels API resource
 * Manages project labels at the workspace level
 */
export class WorkspaceProjectLabels extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string): Promise<WorkspaceProjectLabel[]> {
    const data = await this.get<WorkspaceProjectLabel[] | { results: WorkspaceProjectLabel[] }>(
      `/workspaces/${workspaceSlug}/project-labels/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateWorkspaceProjectLabel): Promise<WorkspaceProjectLabel> {
    return this.post<WorkspaceProjectLabel>(`/workspaces/${workspaceSlug}/project-labels/`, data);
  }

  async update(
    workspaceSlug: string,
    labelId: string,
    data: UpdateWorkspaceProjectLabel
  ): Promise<WorkspaceProjectLabel> {
    return this.patch<WorkspaceProjectLabel>(`/workspaces/${workspaceSlug}/project-labels/${labelId}/`, data);
  }

  async del(workspaceSlug: string, labelId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/project-labels/${labelId}/`);
  }
}
