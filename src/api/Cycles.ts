import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";

import {
  Cycle,
  CreateCycleRequest,
  UpdateCycleRequest,
  TransferCycleWorkItemRequest,
} from "../models/Cycle";
import { WorkItem } from "../models/WorkItem";

/**
 * Cycles API resource
 * Handles all cycle (sprint) related operations
 */
export class Cycles extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new cycle
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    createCycle: CreateCycleRequest
  ): Promise<Cycle> {
    return this.post<Cycle>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/`,
      createCycle
    );
  }

  /**
   * Retrieve a cycle by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    cycleId: string
  ): Promise<Cycle> {
    return this.get<Cycle>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/`
    );
  }

  /**
   * Update a cycle
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    cycleId: string,
    updateCycle: UpdateCycleRequest
  ): Promise<Cycle> {
    return this.patch<Cycle>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/`,
      updateCycle
    );
  }

  /**
   * Delete a cycle
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    cycleId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/`
    );
  }

  /**
   * List cycles with optional filtering
   */
  async list(
    workspaceSlug: string,
    projectId: string
  ): Promise<PaginatedResponse<Cycle>> {
    return this.get<PaginatedResponse<Cycle>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/`
    );
  }

  /**
   * List archived cycles
   */
  async listArchived(
    workspaceSlug: string,
    projectId: string,
    params?: any
  ): Promise<PaginatedResponse<Cycle>> {
    return this.get<PaginatedResponse<Cycle>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/archived-cycles/`,
      params
    );
  }

  /**
   * Unarchive a cycle
   */
  async unArchive(
    workspaceSlug: string,
    projectId: string,
    cycleId: string
  ): Promise<void> {
    return this.delete<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/archived-cycles/${cycleId}/unarchive/`
    );
  }

  /**
   * Archive a cycle
   */
  async archive(
    workspaceSlug: string,
    projectId: string,
    cycleId: string
  ): Promise<void> {
    return this.post<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/archived-cycles/${cycleId}/archive/`
    );
  }

  /**
   * List work items in cycle
   */
  async listWorkItemsInCycle(
    workspaceSlug: string,
    projectId: string,
    cycleId: string,
    params?: any
  ): Promise<PaginatedResponse<WorkItem>> {
    return this.get<PaginatedResponse<WorkItem>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/cycle-issues/`,
      params
    );
  }

  /**
   * Add work items to cycle
   */
  async addWorkItemsToCycle(
    workspaceSlug: string,
    projectId: string,
    cycleId: string,
    workItemIds: string[]
  ): Promise<void> {
    return this.post<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/cycle-issues/`,
      { issues: workItemIds }
    );
  }

  /**
   * Remove work item from cycle
   */
  async removeWorkItemFromCycle(
    workspaceSlug: string,
    projectId: string,
    cycleId: string,
    workItemId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/cycle-issues/${workItemId}/`
    );
  }

  /**
   * Transfer work items to another cycle
   */
  async transferWorkItemsToAnotherCycle(
    workspaceSlug: string,
    projectId: string,
    cycleId: string,
    transferData: TransferCycleWorkItemRequest
  ): Promise<void> {
    return this.post<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}/transfer-issues/`,
      transferData
    );
  }
}
