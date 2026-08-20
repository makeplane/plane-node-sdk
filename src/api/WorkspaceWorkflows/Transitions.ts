import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkspaceWorkflowTransition,
  UpdateWorkspaceWorkflowTransition,
  WorkspaceWorkflowTransition,
} from "../../models/WorkspaceWorkflow";

/**
 * WorkspaceWorkflows.transitions sub-resource
 * Manages state transitions within a workspace workflow
 */
export class Transitions extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List all state transitions for a workspace workflow
   */
  async list(workspaceSlug: string, workflowId: string): Promise<WorkspaceWorkflowTransition[]> {
    const data = await this.get<WorkspaceWorkflowTransition[] | { results: WorkspaceWorkflowTransition[] }>(
      `/workspaces/${workspaceSlug}/workflows/${workflowId}/state-transitions/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Create a state transition for a workspace workflow
   */
  async create(
    workspaceSlug: string,
    workflowId: string,
    data: CreateWorkspaceWorkflowTransition
  ): Promise<WorkspaceWorkflowTransition> {
    return this.post<WorkspaceWorkflowTransition>(
      `/workspaces/${workspaceSlug}/workflows/${workflowId}/state-transitions/`,
      data
    );
  }

  /**
   * Retrieve a workspace workflow transition by ID
   */
  async retrieve(
    workspaceSlug: string,
    workflowId: string,
    transitionId: string
  ): Promise<WorkspaceWorkflowTransition> {
    return this.get<WorkspaceWorkflowTransition>(
      `/workspaces/${workspaceSlug}/workflows/${workflowId}/state-transitions/${transitionId}/`
    );
  }

  /**
   * Update a workspace workflow transition
   */
  async update(
    workspaceSlug: string,
    workflowId: string,
    transitionId: string,
    data: UpdateWorkspaceWorkflowTransition
  ): Promise<WorkspaceWorkflowTransition> {
    return this.patch<WorkspaceWorkflowTransition>(
      `/workspaces/${workspaceSlug}/workflows/${workflowId}/state-transitions/${transitionId}/`,
      data
    );
  }

  /**
   * Delete a workspace workflow transition
   */
  async del(workspaceSlug: string, workflowId: string, transitionId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/workflows/${workflowId}/state-transitions/${transitionId}/`);
  }
}
