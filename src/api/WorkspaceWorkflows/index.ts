import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { PaginatedResponse } from "../../models/common";
import { WorkflowActivity } from "../../models/Workflow";
import {
  CreateWorkspaceWorkflow,
  UpdateWorkspaceWorkflow,
  WorkspaceWorkflow,
  WorkspaceWorkflowUsage,
} from "../../models/WorkspaceWorkflow";
import { States } from "./States";
import { Transitions } from "./Transitions";
import { Hooks } from "./Hooks";

export type ListWorkspaceWorkflowsParams = {
  search?: string;
  is_active?: boolean;
  sort_by?: "name" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
  cursor?: string;
  per_page?: number;
};

export type ListWorkspaceWorkflowActivitiesParams = {
  created_at__gt?: string;
};

/**
 * WorkspaceWorkflows API resource
 * Manages the workspace workflow catalog (workspace governance) and exposes
 * states/transitions/hooks sub-resources.
 *
 * `list` is dual-mode: under workspace governance it serves the workspace
 * workflow catalog; in ungoverned workspaces it aggregates project workflows.
 * All writes require the workspace to own states and workflows — otherwise
 * the API responds 400 with code `workspace_not_managed`.
 */
export class WorkspaceWorkflows extends BaseResource {
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
   * List workspace workflows
   */
  async list(
    workspaceSlug: string,
    params?: ListWorkspaceWorkflowsParams
  ): Promise<PaginatedResponse<WorkspaceWorkflow>> {
    return this.get<PaginatedResponse<WorkspaceWorkflow>>(`/workspaces/${workspaceSlug}/workflows/`, params);
  }

  /**
   * Create a workspace workflow draft (configure its chain via `states`).
   * Workflow names are workspace-unique.
   */
  async create(workspaceSlug: string, data: CreateWorkspaceWorkflow): Promise<WorkspaceWorkflow> {
    return this.post<WorkspaceWorkflow>(`/workspaces/${workspaceSlug}/workflows/`, data);
  }

  /**
   * Retrieve a workspace workflow with its full chain
   */
  async retrieve(workspaceSlug: string, workflowId: string): Promise<WorkspaceWorkflow> {
    return this.get<WorkspaceWorkflow>(`/workspaces/${workspaceSlug}/workflows/${workflowId}/`);
  }

  /**
   * Update workspace workflow metadata (name, description, is_active)
   */
  async update(workspaceSlug: string, workflowId: string, data: UpdateWorkspaceWorkflow): Promise<WorkspaceWorkflow> {
    return this.patch<WorkspaceWorkflow>(`/workspaces/${workspaceSlug}/workflows/${workflowId}/`, data);
  }

  /**
   * Delete a workspace workflow.
   * The default workflow and workflows in use by projects cannot be deleted.
   */
  async delete(workspaceSlug: string, workflowId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/workflows/${workflowId}/`);
  }

  /**
   * Report which projects/types resolve to this workflow, and which types
   * mandate or allow it
   */
  async usage(workspaceSlug: string, workflowId: string): Promise<WorkspaceWorkflowUsage> {
    return this.get<WorkspaceWorkflowUsage>(`/workspaces/${workspaceSlug}/workflows/${workflowId}/usage/`);
  }

  /**
   * List the workflow's activity/audit entries
   */
  async activities(
    workspaceSlug: string,
    workflowId: string,
    params?: ListWorkspaceWorkflowActivitiesParams
  ): Promise<WorkflowActivity[]> {
    const data = await this.get<WorkflowActivity[] | { results: WorkflowActivity[] }>(
      `/workspaces/${workspaceSlug}/workflows/${workflowId}/activities/`,
      params
    );
    return Array.isArray(data) ? data : data.results;
  }
}
