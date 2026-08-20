import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkflowTransitionHook,
  UpdateWorkflowTransitionHook,
  WorkflowTransitionHook,
} from "../../models/Workflow";

/**
 * WorkflowTransitionHooks sub-resource
 * Manages hooks attached to project workflow transitions
 */
export class Hooks extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  private basePath(workspaceSlug: string, projectId: string, workflowId: string, transitionId: string): string {
    return (
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}` +
      `/state-transitions/${transitionId}/hooks`
    );
  }

  /**
   * List hooks on a workflow transition
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    transitionId: string
  ): Promise<WorkflowTransitionHook[]> {
    const data = await this.get<WorkflowTransitionHook[] | { results: WorkflowTransitionHook[] }>(
      `${this.basePath(workspaceSlug, projectId, workflowId, transitionId)}/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Create a hook on a workflow transition.
   * For send_webhook handlers the one-shot `secret_plaintext` is included in
   * the response of this call only.
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    transitionId: string,
    data: CreateWorkflowTransitionHook
  ): Promise<WorkflowTransitionHook> {
    return this.post<WorkflowTransitionHook>(
      `${this.basePath(workspaceSlug, projectId, workflowId, transitionId)}/`,
      data
    );
  }

  /**
   * Retrieve a hook by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    transitionId: string,
    hookId: string
  ): Promise<WorkflowTransitionHook> {
    return this.get<WorkflowTransitionHook>(
      `${this.basePath(workspaceSlug, projectId, workflowId, transitionId)}/${hookId}/`
    );
  }

  /**
   * Update a hook (`phase` and `handler_name` are immutable)
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    transitionId: string,
    hookId: string,
    data: UpdateWorkflowTransitionHook
  ): Promise<WorkflowTransitionHook> {
    return this.patch<WorkflowTransitionHook>(
      `${this.basePath(workspaceSlug, projectId, workflowId, transitionId)}/${hookId}/`,
      data
    );
  }

  /**
   * Delete a hook
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    transitionId: string,
    hookId: string
  ): Promise<void> {
    return this.httpDelete(`${this.basePath(workspaceSlug, projectId, workflowId, transitionId)}/${hookId}/`);
  }
}
