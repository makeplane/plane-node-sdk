import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";

import { Milestone, CreateMilestoneRequest, UpdateMilestoneRequest, MilestoneWorkItem } from "../models/Milestone";

/**
 * Milestones API resource
 * Handles all milestone related operations
 */
export class Milestones extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new milestone
   */
  async create(workspaceSlug: string, projectId: string, createMilestone: CreateMilestoneRequest): Promise<Milestone> {
    return this.post<Milestone>(`/workspaces/${workspaceSlug}/projects/${projectId}/milestones/`, createMilestone);
  }

  /**
   * Retrieve a milestone by ID
   */
  async retrieve(workspaceSlug: string, projectId: string, milestoneId: string): Promise<Milestone> {
    return this.get<Milestone>(`/workspaces/${workspaceSlug}/projects/${projectId}/milestones/${milestoneId}/`);
  }

  /**
   * Update a milestone
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    milestoneId: string,
    updateMilestone: UpdateMilestoneRequest
  ): Promise<Milestone> {
    return this.patch<Milestone>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/milestones/${milestoneId}/`,
      updateMilestone
    );
  }

  /**
   * Delete a milestone
   */
  async delete(workspaceSlug: string, projectId: string, milestoneId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/milestones/${milestoneId}/`);
  }

  /**
   * List milestones with optional filtering
   */
  async list(workspaceSlug: string, projectId: string, params?: any): Promise<PaginatedResponse<Milestone>> {
    return this.get<PaginatedResponse<Milestone>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/milestones/`,
      params
    );
  }

  /**
   * Add work items to a milestone
   */
  async addWorkItems(workspaceSlug: string, projectId: string, milestoneId: string, issueIds: string[]): Promise<void> {
    return this.post<void>(`/workspaces/${workspaceSlug}/projects/${projectId}/milestones/${milestoneId}/work-items/`, {
      issues: issueIds,
    });
  }

  /**
   * Remove work items from a milestone
   */
  async removeWorkItems(
    workspaceSlug: string,
    projectId: string,
    milestoneId: string,
    issueIds: string[]
  ): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/milestones/${milestoneId}/work-items/`, {
      issues: issueIds,
    });
  }

  /**
   * List work items in a milestone
   */
  async listWorkItems(
    workspaceSlug: string,
    projectId: string,
    milestoneId: string,
    params?: any
  ): Promise<PaginatedResponse<MilestoneWorkItem>> {
    return this.get<PaginatedResponse<MilestoneWorkItem>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/milestones/${milestoneId}/work-items/`,
      params
    );
  }
}
