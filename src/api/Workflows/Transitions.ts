import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { HttpError } from "../../errors";
import { CreateWorkflowTransition, UpdateWorkflowTransition, WorkflowTransition } from "../../models/Workflow";

/**
 * WorkflowTransitions sub-resource
 * Manages state transitions within a workflow
 */
export class Transitions extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List all state transitions for a workflow
   */
  async list(workspaceSlug: string, projectId: string, workflowId: string): Promise<WorkflowTransition[]> {
    const data = await this.get<WorkflowTransition[] | { results: WorkflowTransition[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/state-transitions/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Create a state transition for a workflow.
   * Returns null if the transition already exists (HTTP 400 "already exists").
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    data: CreateWorkflowTransition
  ): Promise<WorkflowTransition | null> {
    try {
      return await this.post<WorkflowTransition>(
        `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/state-transitions/`,
        data
      );
    } catch (error) {
      if (error instanceof HttpError && error.statusCode === 400) {
        const body = JSON.stringify(error.response ?? "").toLowerCase();
        if (body.includes("already exists")) {
          return null;
        }
      }
      throw error;
    }
  }

  /**
   * Update a workflow state transition
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    transitionId: string,
    data: UpdateWorkflowTransition
  ): Promise<WorkflowTransition> {
    return this.patch<WorkflowTransition>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/state-transitions/${transitionId}/`,
      data
    );
  }

  /**
   * Delete a workflow state transition
   */
  async del(workspaceSlug: string, projectId: string, workflowId: string, transitionId: string): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/state-transitions/${transitionId}/`
    );
  }
}
