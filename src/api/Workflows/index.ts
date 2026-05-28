import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateWorkflow, UpdateWorkflow, Workflow } from "../../models/Workflow";
import { States } from "./States";
import { Transitions } from "./Transitions";

/**
 * Workflows API resource
 * Handles project workflow operations and exposes states/transitions sub-resources
 */
export class Workflows extends BaseResource {
  public states: States;
  public transitions: Transitions;

  constructor(config: Configuration) {
    super(config);
    this.states = new States(config);
    this.transitions = new Transitions(config);
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
   * Update a workflow by ID
   */
  async update(workspaceSlug: string, projectId: string, workflowId: string, data: UpdateWorkflow): Promise<Workflow> {
    return this.patch<Workflow>(`/workspaces/${workspaceSlug}/projects/${projectId}/workflows/${workflowId}/`, data);
  }
}
