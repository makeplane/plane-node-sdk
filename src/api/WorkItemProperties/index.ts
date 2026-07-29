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
  async delete(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    workItemPropertyId: string
  ): Promise<void> {
    return this.httpDelete(
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

  // ===== PROJECT-LEVEL PROPERTY SURFACE =====

  /**
   * List project-level work item properties (not scoped to a type)
   */
  async listProject(
    workspaceSlug: string,
    projectId: string,
    params?: ListWorkItemPropertiesParams
  ): Promise<WorkItemProperty[]> {
    return this.get<WorkItemProperty[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/`,
      params
    );
  }

  /**
   * Create a project-level work item property
   */
  async createProject(
    workspaceSlug: string,
    projectId: string,
    createWorkItemProperty: CreateWorkItemProperty
  ): Promise<WorkItemProperty> {
    return this.post<WorkItemProperty>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/`,
      createWorkItemProperty
    );
  }

  /**
   * Retrieve a project-level work item property
   */
  async retrieveProject(workspaceSlug: string, projectId: string, propertyId: string): Promise<WorkItemProperty> {
    return this.get<WorkItemProperty>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/`
    );
  }

  /**
   * Update a project-level work item property
   */
  async updateProject(
    workspaceSlug: string,
    projectId: string,
    propertyId: string,
    updateWorkItemProperty: UpdateWorkItemProperty
  ): Promise<WorkItemProperty> {
    return this.patch<WorkItemProperty>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/`,
      updateWorkItemProperty
    );
  }

  /**
   * Delete a project-level work item property
   */
  async deleteProject(workspaceSlug: string, projectId: string, propertyId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/work-item-properties/${propertyId}/`);
  }

  /**
   * Attach existing project-level properties to a work item type.
   *
   * @returns The property ids now attached to the type.
   */
  async attachToType(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    propertyIds: string[]
  ): Promise<string[]> {
    const response = await this.post<{ properties?: string[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/properties/`,
      { properties: propertyIds }
    );
    return response?.properties ?? [];
  }

  /**
   * Detach a property from a work item type
   */
  async detachFromType(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    propertyId: string
  ): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/properties/${propertyId}/`
    );
  }
}
