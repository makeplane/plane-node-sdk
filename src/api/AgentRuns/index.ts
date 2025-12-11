import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { AgentRun, CreateAgentRunRequest } from "../../models/AgentRun";
import { Activities } from "./Activities";

/**
 * Agent Runs API resource
 * Handles all agent run operations
 */
export class AgentRuns extends BaseResource {
  public activities: Activities;

  constructor(config: Configuration) {
    super(config);
    this.activities = new Activities(config);
  }

  /**
   * Create a new agent run
   * @param workspaceSlug - The workspace slug
   * @param data - The agent run data to create
   * @returns The created agent run
   */
  async create(workspaceSlug: string, data: CreateAgentRunRequest): Promise<AgentRun> {
    return this.post<AgentRun>(`/workspaces/${workspaceSlug}/runs/`, data);
  }

  /**
   * Retrieve an agent run by ID
   * @param workspaceSlug - The workspace slug
   * @param runId - The agent run ID
   * @returns The agent run
   */
  async retrieve(workspaceSlug: string, runId: string): Promise<AgentRun> {
    return this.get<AgentRun>(`/workspaces/${workspaceSlug}/runs/${runId}/`);
  }

  /**
   * Resume an agent run
   * @param workspaceSlug - The workspace slug
   * @param runId - The agent run ID
   * @returns The resumed agent run
   */
  async resume(workspaceSlug: string, runId: string): Promise<AgentRun> {
    return this.post<AgentRun>(`/workspaces/${workspaceSlug}/runs/${runId}/`);
  }
}

