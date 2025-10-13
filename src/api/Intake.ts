import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";
import {
  IntakeWorkItem,
  IntakeWorkItemCreateRequest,
  UpdateIntakeWorkItemRequest,
} from "../models/Intake";

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
  ): Promise<IntakeWorkItem> {
    return this.get<IntakeWorkItem>(
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
  ): Promise<PaginatedResponse<IntakeWorkItem>> {
    return this.get<PaginatedResponse<IntakeWorkItem>>(
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
    intakeData: IntakeWorkItemCreateRequest
  ): Promise<IntakeWorkItem> {
    return this.post<IntakeWorkItem>(
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
    updateData: UpdateIntakeWorkItemRequest
  ): Promise<IntakeWorkItem> {
    return this.patch<IntakeWorkItem>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/intake-issues/${intakeId}/`,
      updateData
    );
  }

  /**
   * Delete an intake issue
   */
  async delete(
    workspaceSlug: string,
    projectId: string,
    intakeId: string
  ): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/intake-issues/${intakeId}/`
    );
  }
}
