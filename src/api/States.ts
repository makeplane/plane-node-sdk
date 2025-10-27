import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";
import {
  CreateState,
  State,
  UpdateState,
  ListStatesParams,
} from "../models/State";

/**
 * States API resource
 * Handles all state related operations
 */
export class States extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new state
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    createState: CreateState
  ): Promise<State> {
    return this.post<State>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/states/`,
      createState
    );
  }

  /**
   * Retrieve a state by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    stateId: string
  ): Promise<State> {
    return this.get<State>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/states/${stateId}/`
    );
  }

  /**
   * Update a state
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    stateId: string,
    updateState: UpdateState
  ): Promise<State> {
    return this.patch<State>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/states/${stateId}/`,
      updateState
    );
  }

  /**
   * Delete a state
   */
  async delete(
    workspaceSlug: string,
    projectId: string,
    stateId: string
  ): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/states/${stateId}/`
    );
  }

  /**
   * List states with optional filtering
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    params?: ListStatesParams
  ): Promise<PaginatedResponse<State>> {
    return this.get<PaginatedResponse<State>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/states/`,
      params
    );
  }
}
