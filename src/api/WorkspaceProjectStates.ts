import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import {
  CreateWorkspaceProjectState,
  UpdateWorkspaceProjectState,
  WorkspaceProjectState,
} from "../models/WorkspaceProjectState";

/**
 * WorkspaceProjectStates API resource
 * Manages project states at the workspace level
 */
export class WorkspaceProjectStates extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string): Promise<WorkspaceProjectState[]> {
    const data = await this.get<WorkspaceProjectState[] | { results: WorkspaceProjectState[] }>(
      `/workspaces/${workspaceSlug}/project-states/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateWorkspaceProjectState): Promise<WorkspaceProjectState> {
    return this.post<WorkspaceProjectState>(`/workspaces/${workspaceSlug}/project-states/`, data);
  }

  async update(
    workspaceSlug: string,
    stateId: string,
    data: UpdateWorkspaceProjectState
  ): Promise<WorkspaceProjectState> {
    return this.patch<WorkspaceProjectState>(`/workspaces/${workspaceSlug}/project-states/${stateId}/`, data);
  }

  async del(workspaceSlug: string, stateId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/project-states/${stateId}/`);
  }
}
