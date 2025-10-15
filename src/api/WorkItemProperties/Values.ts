import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import {
  UpdateWorkItemPropertyValue,
  ListWorkItemPropertyValuesParams,
  WorkItemPropertyValues,
} from '../../models/WorkItemProperty';

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
  ): Promise<WorkItemPropertyValues> {
    const propertyValues = await this.get<WorkItemPropertyValues>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/`
    );
    return propertyValues;
  }

  /**
   * List property values for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    params?: ListWorkItemPropertyValuesParams
  ): Promise<WorkItemPropertyValues> {
    return this.get<WorkItemPropertyValues>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/values/`,
      params
    );
  }


  /**
   * Create/update a property value
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    propertyId: string,
    updateData: UpdateWorkItemPropertyValue
  ): Promise<WorkItemPropertyValues> {
    return this.post<WorkItemPropertyValues>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/`,
      updateData
    );
  }
}
