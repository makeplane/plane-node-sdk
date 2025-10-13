import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import {
  WorkItemProperty,
  CreateWorkItemProperty,
  UpdateWorkItemProperty,
  ListWorkItemPropertiesParams,
  WorkItemPropertyOption,
  CreateWorkItemPropertyOption,
  UpdateWorkItemPropertyOption,
  ListWorkItemPropertyOptionsParams,
  WorkItemPropertyValue,
  CreateWorkItemPropertyValue,
  UpdateWorkItemPropertyValue,
  ListWorkItemPropertyValuesParams,
} from '../../models/WorkItemProperty';
import { Options } from './Options';
import { Values } from './Values';

/**
 * WorkItemProperties API resource
 * Handles all work item property related operations
 */
export class WorkItemProperties extends BaseResource {
  public options: Options;
  public values: Values;

  constructor(config: Configuration) {
    super(config);
    this.options = new Options(config);
    this.values = new Values(config);
  }

  /**
   * Create a new work item property
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    createWorkItemProperty: CreateWorkItemProperty
  ): Promise<WorkItemProperty> {
    return this.post<WorkItemProperty>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/work-item-properties/`,
      createWorkItemProperty
    );
  }

  /**
   * Retrieve a work item property by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    workItemPropertyId: string
  ): Promise<WorkItemProperty> {
    return this.get<WorkItemProperty>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/work-item-properties/${workItemPropertyId}/`
    );
  }

  /**
   * Update a work item property
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    workItemPropertyId: string,
    updateWorkItemProperty: UpdateWorkItemProperty
  ): Promise<WorkItemProperty> {
    return this.patch<WorkItemProperty>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/work-item-properties/${workItemPropertyId}/`,
      updateWorkItemProperty
    );
  }

  /**
   * Delete a work item property
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    workItemPropertyId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/work-item-properties/${workItemPropertyId}/`
    );
  }

  /**
   * List work item properties with optional filtering
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    params?: ListWorkItemPropertiesParams
  ): Promise<WorkItemProperty[]> {
    return this.get<WorkItemProperty[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/work-item-properties/`,
      params
    );
  }

  // ===== PROPERTY OPTIONS API METHODS =====

  /**
   * Create a new work item property option
   */
  async createPropertyOption(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    createPropertyOption: CreateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOption> {
    return this.post<WorkItemPropertyOption>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/options/`,
      createPropertyOption
    );
  }

  /**
   * Retrieve a work item property option by ID
   */
  async retrievePropertyOption(
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
   * Update a work item property option
   */
  async updatePropertyOption(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    optionId: string,
    updatePropertyOption: UpdateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOption> {
    return this.patch<WorkItemPropertyOption>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/options/${optionId}/`,
      updatePropertyOption
    );
  }

  /**
   * Delete a work item property option
   */
  async deletePropertyOption(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    optionId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/options/${optionId}/`
    );
  }

  /**
   * List work item property options with optional filtering
   */
  async listPropertyOptions(
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

  // ===== PROPERTY VALUES API METHODS =====

  /**
   * Create/update a work item property value
   */
  async createPropertyValue(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    propertyId: string,
    createPropertyValue: CreateWorkItemPropertyValue
  ): Promise<WorkItemPropertyValue> {
    return this.post<WorkItemPropertyValue>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${issueId}/work-item-properties/${propertyId}/values/`,
      createPropertyValue
    );
  }

  /**
   * List work item property values for a specific property
   */
  async listPropertyValues(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    propertyId: string,
    params?: ListWorkItemPropertyValuesParams
  ): Promise<WorkItemPropertyValue[]> {
    return this.get<WorkItemPropertyValue[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${issueId}/work-item-properties/${propertyId}/values/`,
      params
    );
  }

  /**
   * List all work item property values for an work item
   */
  async listAllPropertyValuesForWorkItem(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    params?: ListWorkItemPropertyValuesParams
  ): Promise<WorkItemPropertyValue[]> {
    return this.get<WorkItemPropertyValue[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${issueId}/work-item-properties/values/`,
      params
    );
  }
}
