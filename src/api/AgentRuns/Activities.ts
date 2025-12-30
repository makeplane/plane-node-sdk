import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { AgentRunActivity, CreateAgentRunActivityRequest } from "../../models/AgentRun";
import { PaginatedResponse } from "../../models/common";

/**
 * Agent Run Activities API resource
 * Handles all agent run activity operations
 */
export class Activities extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List activities for an agent run
   * @param workspaceSlug - The workspace slug
   * @param runId - The agent run ID
   * @param params - Optional query parameters for pagination
   * @returns Paginated list of agent run activities
   */
  async list(
    workspaceSlug: string,
    runId: string,
    params?: { per_page?: number; cursor?: string }
  ): Promise<PaginatedResponse<AgentRunActivity>> {
    return this.get<PaginatedResponse<AgentRunActivity>>(
      `/workspaces/${workspaceSlug}/runs/${runId}/activities/`,
      params
    );
  }

  /**
   * Retrieve a specific agent run activity by ID
   * @param workspaceSlug - The workspace slug
   * @param runId - The agent run ID
   * @param activityId - The activity ID
   * @returns The agent run activity
   */
  async retrieve(workspaceSlug: string, runId: string, activityId: string): Promise<AgentRunActivity> {
    return this.get<AgentRunActivity>(`/workspaces/${workspaceSlug}/runs/${runId}/activities/${activityId}/`);
  }

  /**
   * Create a new agent run activity
   * @param workspaceSlug - The workspace slug
   * @param runId - The agent run ID
   * @param data - The activity data to create
   * @returns The created agent run activity
   */
  async create(workspaceSlug: string, runId: string, data: CreateAgentRunActivityRequest): Promise<AgentRunActivity> {
    return this.post<AgentRunActivity>(`/workspaces/${workspaceSlug}/runs/${runId}/activities/`, data);
  }
}

