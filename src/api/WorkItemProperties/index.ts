import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  WorkItemProperty,
  CreateWorkItemProperty,
  UpdateWorkItemProperty,
  ListWorkItemPropertiesParams,
} from "../../models/WorkItemProperty";
import { Options } from "./Options";
import { Values } from "./Values";

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
}
