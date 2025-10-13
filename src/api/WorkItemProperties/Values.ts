import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import {
  WorkItemPropertyValueAPI,
  WorkItemPropertyValueAPIRequest,
  WorkItemPropertyValueAPIDetail,
} from '../../models/schema-types';

/**
 * WorkItemPropertyValues API resource
 * Handles all work item property value operations
 */
export class Values extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve a property value by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    propertyId: string,
    valueId: string
  ): Promise<WorkItemPropertyValueAPI> {
    return this.get<WorkItemPropertyValueAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/${valueId}/`
    );
  }

  /**
   * List property values for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    params?: any
  ): Promise<WorkItemPropertyValueAPIDetail[]> {
    return this.get<WorkItemPropertyValueAPIDetail[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/values/`
    );
  }

  /**
   * Create a property value
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    propertyId: string,
    valueData: WorkItemPropertyValueAPIRequest
  ): Promise<WorkItemPropertyValueAPI> {
    return this.post<WorkItemPropertyValueAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/`,
      {
        values: [
          {
            value: valueData,
          },
        ],
      }
    );
  }

  /**
   * Update a property value
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    propertyId: string,
    valueId: string,
    updateData: WorkItemPropertyValueAPIRequest
  ): Promise<WorkItemPropertyValueAPI> {
    return this.patch<WorkItemPropertyValueAPI>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/${valueId}/`,
      updateData
    );
  }

  /**
   * Delete a property value
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    propertyId: string,
    valueId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/${valueId}/`
    );
  }
}
