import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkflow,
  SubmitWorkItemApproval,
  UpdateWorkflow,
  WorkItemApprovalResult,
  Workflow,
  WorkflowActivity,
} from "../../models/Workflow";
import { States } from "./States";
import { Transitions } from "./Transitions";
import { Hooks } from "./Hooks";

export type ListWorkflowActivitiesParams = {
  created_at__gt?: string;
};

/**
 * Workflows API resource
 * Handles project workflow operations and exposes states/transitions/hooks
 * sub-resources.
 *
 * Under workspace governance, workflows are managed at the workspace level
 * (see `WorkspaceWorkflows`) and project-scoped writes respond 400 with code
 * `workspace_managed`.
 */
export class Workflows extends BaseResource {
  public states: States;
  public transitions: Transitions;
  public hooks: Hooks;

  constructor(config: Configuration) {
    super(config);
    this.states = new States(config);
    this.transitions = new Transitions(config);
    this.hooks = new Hooks(config);
  }

  /**
   * List all workflows for a project
   */
  async list(workspaceSlug: string, projectId: string): Promise<Workflow[]> {
    const data = await this.get<Workflow[] | { results: Workflow[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Create a new workflow for a project
   */
  async create(workspaceSlug: string, projectId: string, data: CreateWorkflow): Promise<Workflow> {
    return this.post<Workflow>(`/workspaces/${workspaceSlug}/projects/${projectId}/workflows/`, data);
  }

  /**
   * Retrieve a workflow by ID
   */
  async retrieve(workspaceSlug: string, projectId: string, workflowId: string): Promise<Workflow> {
    return this.get<Workflow>(`/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/`);
  }

  /**
   * Update a workflow by ID
   */
  async update(workspaceSlug: string, projectId: string, workflowId: string, data: UpdateWorkflow): Promise<Workflow> {
    return this.patch<Workflow>(`/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/`, data);
  }

  /**
   * Delete a workflow by ID.
   * The default workflow cannot be deleted.
   */
  async delete(workspaceSlug: string, projectId: string, workflowId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/`);
  }

  /**
   * List the workflow's activity/audit entries
   */
  async activities(
    workspaceSlug: string,
    projectId: string,
    workflowId: string,
    params?: ListWorkflowActivitiesParams
  ): Promise<WorkflowActivity[]> {
    const data = await this.get<WorkflowActivity[] | { results: WorkflowActivity[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/activities/`,
      params
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Approve or reject a work item's pending workflow transition
   */
  async submitWorkItemApproval(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    data: SubmitWorkItemApproval
  ): Promise<WorkItemApprovalResult> {
    return this.post<WorkItemApprovalResult>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/workflow-approval/`,
      data
    );
  }
}
