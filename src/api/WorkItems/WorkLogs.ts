import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import {
  WorkItemWorkLogAPI,
  WorkItemWorkLogAPIRequest,
  PatchedIssueWorkLogAPIRequest,
} from '../../models/schema-types';

/**
 * WorkLogs API resource
 * Handles all work log operations for work items
 */
export class WorkLogs extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve a work log by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    workLogId: string
  ): Promise<WorkItemWorkLogAPI> {
    return this.get<WorkItemWorkLogAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-logs/${workLogId}/`
    );
  }

  /**
   * List work logs for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    params?: any
  ): Promise<WorkItemWorkLogAPI[]> {
    return this.get<WorkItemWorkLogAPI[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-logs/`,
      params
    );
  }

  /**
   * Create a work log for a work item
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    workLogData: WorkItemWorkLogAPIRequest
  ): Promise<WorkItemWorkLogAPI> {
    return this.post<WorkItemWorkLogAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-logs/`,
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
    updateData: PatchedIssueWorkLogAPIRequest
  ): Promise<WorkItemWorkLogAPI> {
    return this.patch<WorkItemWorkLogAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-logs/${workLogId}/`,
      updateData
    );
  }

  /**
   * Delete a work log
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    workLogId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-logs/${workLogId}/`
    );
  }
}
