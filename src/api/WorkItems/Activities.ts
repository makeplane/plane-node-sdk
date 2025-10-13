import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import { WorkItemActivity } from '../../models/schema-types';
import { PaginatedResponse } from '../../models/common';

/**
 * WorkItemActivities API resource
 * Handles all work item activity operations
 */
export class Activities extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List activities for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    params?: any
  ): Promise<PaginatedResponse<WorkItemActivity>> {
    return this.get<PaginatedResponse<WorkItemActivity>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/activities/`,
      params
    );
  }

  /**
   * Retrieve a specific activity by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    activityId: string
  ): Promise<WorkItemActivity> {
    return this.get<WorkItemActivity>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/activities/${activityId}/`
    );
  }
}
