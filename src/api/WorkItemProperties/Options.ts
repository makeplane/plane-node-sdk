import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import {
  WorkItemPropertyOptionAPI,
  WorkItemPropertyOptionAPIRequest,
  PatchedIssuePropertyOptionAPIRequest,
} from '../../models/schema-types';

/**
 * WorkItemPropertyOptions API resource
 * Handles all work item property option operations
 */
export class Options extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve a property option by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    optionId: string
  ): Promise<WorkItemPropertyOptionAPI> {
    return this.get<WorkItemPropertyOptionAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/options/${optionId}/`
    );
  }

  /**
   * List property options
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    params?: any
  ): Promise<WorkItemPropertyOptionAPI[]> {
    return this.get<WorkItemPropertyOptionAPI[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/options/`,
      params
    );
  }

  /**
   * Create a property option
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    optionData: WorkItemPropertyOptionAPIRequest
  ): Promise<WorkItemPropertyOptionAPI> {
    return this.post<WorkItemPropertyOptionAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/options/`,
      optionData
    );
  }

  /**
   * Update a property option
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    optionId: string,
    updateData: PatchedIssuePropertyOptionAPIRequest
  ): Promise<WorkItemPropertyOptionAPI> {
    return this.patch<WorkItemPropertyOptionAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/options/${optionId}/`,
      updateData
    );
  }

  /**
   * Delete a property option
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    optionId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/options/${optionId}/`
    );
  }
}
