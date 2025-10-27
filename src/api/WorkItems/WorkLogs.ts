import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  WorkLog,
  CreateWorkLogRequest,
  UpdateWorkLogRequest,
} from "../../models/WorkLog";

/**
 * WorkLogs API resource
 * Handles all work log operations for work items
 */
export class WorkLogs extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List work logs for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string
  ): Promise<WorkLog[]> {
    return this.get<WorkLog[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/worklogs/`
    );
  }

  /**
   * Create a work log for a work item
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    workLogData: CreateWorkLogRequest
  ): Promise<WorkLog> {
    return this.post<WorkLog>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/worklogs/`,
      workLogData
    );
  }

  /**
   * Update a work log
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    workLogId: string,
    updateData: UpdateWorkLogRequest
  ): Promise<WorkLog> {
    return this.patch<WorkLog>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/worklogs/${workLogId}/`,
      updateData
    );
  }

  /**
   * Delete a work log
   */
  async delete(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    workLogId: string
  ): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/worklogs/${workLogId}/`
    );
  }
}
