import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { AttachWorkflowStates, UpdateWorkflowState, WorkflowState } from "../../models/Workflow";

/**
 * WorkflowStates sub-resource
 * Manages state attachments on a workflow
 */
export class States extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List the states attached to a workflow
   */
  async list(workspaceSlug: string, projectId: string, workflowId: string): Promise<WorkflowState[]> {
    const data = await this.get<WorkflowState[] | { results: WorkflowState[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/states/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Attach states to a workflow
   */
  async attach(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    data: AttachWorkflowStates
  ): Promise<void> {
    return this.post<void>(`/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/states/`, data);
  }

  /**
   * Update a state's membership row (type, allow_issue_creation, is_default)
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    stateId: string,
    data: UpdateWorkflowState
  ): Promise<WorkflowState | null> {
    const response = await this.patch<WorkflowState | null>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/states/${stateId}/`,
      data
    );
    return response ?? null;
  }

  /**
   * Detach a state from a workflow
   */
  async detach(workspaceSlug: string, projectId: string, workflowId: string, stateId: string): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/states/${stateId}/`
    );
  }

  /**
   * Transfer work items off a state and remove it from the workflow
   */
  async transfer(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    stateId: string,
    newStateId: string
  ): Promise<void> {
    return this.post<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/states/${stateId}/transfer/`,
      { new_state_id: newStateId }
    );
  }
}
