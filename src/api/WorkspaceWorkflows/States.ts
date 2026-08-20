import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  AddWorkspaceWorkflowStates,
  RemoveWorkspaceWorkflowState,
  UpdateWorkspaceWorkflowState,
  WorkspaceWorkflowState,
} from "../../models/WorkspaceWorkflow";

/**
 * WorkspaceWorkflows.states sub-resource
 * Manages a workspace workflow's chain (state memberships)
 */
export class States extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Append catalog states to the workflow's chain.
   * Returns the updated chain rows.
   */
  async add(
    workspaceSlug: string,
    workflowId: string,
    data: AddWorkspaceWorkflowStates
  ): Promise<WorkspaceWorkflowState[]> {
    const result = await this.post<WorkspaceWorkflowState[] | WorkspaceWorkflowState>(
      `/workspaces/${workspaceSlug}/workflows/${workflowId}/states/`,
      data
    );
    return Array.isArray(result) ? result : [result];
  }

  /**
   * Update a chain membership row (type, allow_issue_creation, is_default).
   * Changing `type` removes the row's existing transitions server-side.
   */
  async update(
    workspaceSlug: string,
    workflowId: string,
    stateId: string,
    data: UpdateWorkspaceWorkflowState
  ): Promise<WorkspaceWorkflowState> {
    return this.patch<WorkspaceWorkflowState>(
      `/workspaces/${workspaceSlug}/workflows/${workflowId}/states/${stateId}/`,
      data
    );
  }

  /**
   * Remove a state from the chain.
   * Orphan-gated: every work item stranded by the removal must be covered by
   * `data.state_mapping` (409 with an orphan report otherwise). Removing the
   * default state requires `data.new_default_state_id`; transitions
   * referencing the state must be removed first.
   */
  async remove(
    workspaceSlug: string,
    workflowId: string,
    stateId: string,
    data?: RemoveWorkspaceWorkflowState
  ): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/workflows/${workflowId}/states/${stateId}/`, data);
  }

  /**
   * Mark a chain state as the workflow's default.
   * Also force-enables work-item creation on that state.
   */
  async markDefault(workspaceSlug: string, workflowId: string, stateId: string): Promise<WorkspaceWorkflowState> {
    return this.post<WorkspaceWorkflowState>(
      `/workspaces/${workspaceSlug}/workflows/${workflowId}/states/${stateId}/mark-default/`,
      undefined
    );
  }
}
