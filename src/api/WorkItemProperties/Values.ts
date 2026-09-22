import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  UpdateWorkItemPropertyValue,
  ListWorkItemPropertyValuesParams,
  WorkItemPropertyValueDetail,
  WorkItemPropertyValues,
} from "../../models/WorkItemProperty";

/**
 * WorkItemPropertyValues API resource
 * Handles all work item property value operations
 */
export class Values extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve a work item's value(s) for one property
   *
   * Answers a single value, or a list when the property holds more than one
   * (multi-select, or a cascading property's levels). A rich text value carries its
   * HTML in `value_detail`; its `value` is the ID of the stored content.
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    propertyId: string
  ): Promise<WorkItemPropertyValueDetail | WorkItemPropertyValueDetail[]> {
    const propertyValues = await this.get<WorkItemPropertyValueDetail | WorkItemPropertyValueDetail[]>(
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
   *
   * A rich text property (`relation_type: "RICH_TEXT"`) takes a `RichTextValue`
   * object, not a bare HTML string.
   *
   * For single-value properties:
   * - Acts as an upsert operation (create or update)
   * - Returns a single WorkItemPropertyValueDetail
   *
   * For multi-value properties (is_multi=True):
   * - Replaces all existing values with the new ones (sync operation)
   * - Returns a list of values
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    propertyId: string,
    updateData: UpdateWorkItemPropertyValue
  ): Promise<WorkItemPropertyValueDetail | WorkItemPropertyValueDetail[]> {
    return this.post<WorkItemPropertyValueDetail | WorkItemPropertyValueDetail[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/`,
      updateData
    );
  }

  /**
   * Update an existing property value(s) (partial update)
   *
   * For single-value properties:
   * - Updates the existing value
   * - Returns a single WorkItemPropertyValueDetail
   *
   * For multi-value properties (is_multi=True):
   * - Replaces all existing values with the new ones (sync operation)
   * - Returns a list of values
   *
   * @throws {HttpError} If the property value does not exist (404)
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    propertyId: string,
    updateData: UpdateWorkItemPropertyValue
  ): Promise<WorkItemPropertyValueDetail | WorkItemPropertyValueDetail[]> {
    return this.patch<WorkItemPropertyValueDetail | WorkItemPropertyValueDetail[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/`,
      updateData
    );
  }

  /**
   * Delete the property value(s) for a work item
   *
   * For single-value properties:
   * - Deletes the single value
   *
   * For multi-value properties (is_multi=True):
   * - Deletes all values for that property
   *
   * @throws {HttpError} If the property value does not exist (404)
   */
  async delete(workspaceSlug: string, projectId: string, workItemId: string, propertyId: string): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-properties/${propertyId}/values/`
    );
  }
}
