import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";
import { WorkItemType, CreateWorkItemType, UpdateWorkItemType } from "../models/WorkItemType";

export interface ListWorkItemTypesParams {
  project?: string;
  limit?: number;
  offset?: number;
}

/**
 * WorkItemTypes API resource
 * Handles all work item type related operations
 */
export class WorkItemTypes extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new work item type
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    createWorkItemType: CreateWorkItemType
  ): Promise<WorkItemType> {
    return this.post<WorkItemType>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/`,
      createWorkItemType
    );
  }

  /**
   * Retrieve a work item type by ID
   */
  async retrieve(workspaceSlug: string, projectId: string, workItemTypeId: string): Promise<WorkItemType> {
    return this.get<WorkItemType>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/`
    );
  }

  /**
   * Update a work item type
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workItemTypeId: string,
    updateWorkItemType: UpdateWorkItemType
  ): Promise<WorkItemType> {
    return this.patch<WorkItemType>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/`,
      updateWorkItemType
    );
  }

  /**
   * Delete a work item type
   */
  async delete(workspaceSlug: string, projectId: string, workItemTypeId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${workItemTypeId}/`);
  }

  /**
   * List work item types with optional filtering
   */
  async list(workspaceSlug: string, projectId: string, params?: ListWorkItemTypesParams): Promise<WorkItemType[]> {
    return this.get<WorkItemType[]>(`/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/`, params);
  }
}
