import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import {
  WorkItemPropertyOption,
  CreateWorkItemPropertyOption,
  UpdateWorkItemPropertyOption,
  ListWorkItemPropertyOptionsParams
} from '../../models/WorkItemProperty';

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
  ): Promise<WorkItemPropertyOption> {
    return this.get<WorkItemPropertyOption>(
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
    params?: ListWorkItemPropertyOptionsParams
  ): Promise<WorkItemPropertyOption[]> {
    return this.get<WorkItemPropertyOption[]>(
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
    optionData: CreateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOption> {
    return this.post<WorkItemPropertyOption>(
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
    updateData: UpdateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOption> {
    return this.patch<WorkItemPropertyOption>(
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
