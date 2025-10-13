import { BaseResource } from './BaseResource';
import { Configuration } from '../Configuration';
import {
  IntakeIssue,
  IntakeIssueCreateRequest,
  PatchedIntakeIssueUpdateRequest,
} from '../models/schema-types';
import { PaginatedResponse } from '../models/common';

/**
 * Intake API resource
 * Handles all intake issue operations
 */
export class Intake extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve an intake issue by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    intakeId: string
  ): Promise<IntakeIssue> {
    return this.get<IntakeIssue>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/intake-issues/${intakeId}/`
    );
  }

  /**
   * List intake issues
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    params?: any
  ): Promise<PaginatedResponse<IntakeIssue>> {
    return this.get<PaginatedResponse<IntakeIssue>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/intake-issues/`,
      params
    );
  }

  /**
   * Create an intake issue
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    intakeData: IntakeIssueCreateRequest
  ): Promise<IntakeIssue> {
    return this.post<IntakeIssue>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/intake-issues/`,
      intakeData
    );
  }

  /**
   * Update an intake issue
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    intakeId: string,
    updateData: PatchedIntakeIssueUpdateRequest
  ): Promise<IntakeIssue> {
    return this.patch<IntakeIssue>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/intake-issues/${intakeId}/`,
      updateData
    );
  }

  /**
   * Delete an intake issue
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    intakeId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/intake-issues/${intakeId}/`
    );
  }
}
