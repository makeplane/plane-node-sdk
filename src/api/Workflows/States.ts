import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { AttachWorkflowStates } from "../../models/Workflow";

/**
 * WorkflowStates sub-resource
 * Manages state attachments on a workflow
 */
export class States extends BaseResource {
  constructor(config: Configuration) {
    super(config);
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
   * Detach a state from a workflow
   */
  async detach(workspaceSlug: string, projectId: string, workflowId: string, stateId: string): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/states/${stateId}/`
    );
  }
}
