import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkflowTransitionHook,
  UpdateWorkflowTransitionHook,
  WorkflowTransitionHook,
} from "../../models/Workflow";

/**
 * One execution history entry for a workflow transition hook
 */
export interface WorkflowTransitionHookExecution {
  id: string;
  status: string;
  started_at?: string;
  completed_at?: string;
  input_data?: unknown;
  output_data?: unknown;
  error_message?: string;
  issue_id?: string;
}

/**
 * WorkspaceWorkflows.hooks sub-resource
 * Manages hooks attached to workspace workflow transitions
 */
export class Hooks extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  private basePath(workspaceSlug: string, workflowId: string, transitionId: string): string {
    return `/workspaces/${workspaceSlug}/workflows/${workflowId}/state-transitions/${transitionId}/hooks`;
  }

  /**
   * List hooks on a workspace workflow transition
   */
  async list(workspaceSlug: string, workflowId: string, transitionId: string): Promise<WorkflowTransitionHook[]> {
    const data = await this.get<WorkflowTransitionHook[] | { results: WorkflowTransitionHook[] }>(
      `${this.basePath(workspaceSlug, workflowId, transitionId)}/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Create a hook on a workspace workflow transition.
   * For send_webhook handlers the one-shot `secret_plaintext` is included in
   * the response of this call only.
   */
  async create(
    workspaceSlug: string,
    workflowId: string,
    transitionId: string,
    data: CreateWorkflowTransitionHook
  ): Promise<WorkflowTransitionHook> {
    return this.post<WorkflowTransitionHook>(`${this.basePath(workspaceSlug, workflowId, transitionId)}/`, data);
  }

  /**
   * Retrieve a hook by ID
   */
  async retrieve(
    workspaceSlug: string,
    workflowId: string,
    transitionId: string,
    hookId: string
  ): Promise<WorkflowTransitionHook> {
    return this.get<WorkflowTransitionHook>(`${this.basePath(workspaceSlug, workflowId, transitionId)}/${hookId}/`);
  }

  /**
   * Update a hook (`phase` and `handler_name` are immutable)
   */
  async update(
    workspaceSlug: string,
    workflowId: string,
    transitionId: string,
    hookId: string,
    data: UpdateWorkflowTransitionHook
  ): Promise<WorkflowTransitionHook> {
    return this.patch<WorkflowTransitionHook>(
      `${this.basePath(workspaceSlug, workflowId, transitionId)}/${hookId}/`,
      data
    );
  }

  /**
   * Delete a hook
   */
  async del(workspaceSlug: string, workflowId: string, transitionId: string, hookId: string): Promise<void> {
    return this.httpDelete(`${this.basePath(workspaceSlug, workflowId, transitionId)}/${hookId}/`);
  }

  /**
   * Regenerate a send_webhook hook's secret.
   * The new one-shot `secret_plaintext` is included in this response only.
   */
  async regenerateSecret(
    workspaceSlug: string,
    workflowId: string,
    transitionId: string,
    hookId: string
  ): Promise<WorkflowTransitionHook> {
    return this.post<WorkflowTransitionHook>(
      `${this.basePath(workspaceSlug, workflowId, transitionId)}/${hookId}/regenerate-webhook-secret/`,
      undefined
    );
  }

  /**
   * List a hook's execution history entries
   */
  async executions(
    workspaceSlug: string,
    workflowId: string,
    transitionId: string,
    hookId: string
  ): Promise<WorkflowTransitionHookExecution[]> {
    const data = await this.get<WorkflowTransitionHookExecution[] | { results: WorkflowTransitionHookExecution[] }>(
      `${this.basePath(workspaceSlug, workflowId, transitionId)}/${hookId}/executions/`
    );
    return Array.isArray(data) ? data : data.results;
  }
}
