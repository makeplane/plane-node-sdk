import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";
import { CreateModuleRequest, UpdateModuleRequest, Module, ListModulesParamsRequest } from "../models/Module";
import { WorkItem } from "../models/WorkItem";

/**
 * Modules API resource
 * Handles all module related operations
 */
export class Modules extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new module
   */
  async create(workspaceSlug: string, projectId: string, createModule: CreateModuleRequest): Promise<Module> {
    return this.post<Module>(`/workspaces/${workspaceSlug}/projects/${projectId}/modules/`, createModule);
  }

  /**
   * Retrieve a module by ID
   */
  async retrieve(workspaceSlug: string, projectId: string, moduleId: string): Promise<Module> {
    return this.get<Module>(`/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/`);
  }

  /**
   * Update a module
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    moduleId: string,
    updateModule: UpdateModuleRequest
  ): Promise<Module> {
    return this.patch<Module>(`/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/`, updateModule);
  }

  /**
   * Delete a module
   */
  async delete(workspaceSlug: string, projectId: string, moduleId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/`);
  }

  /**
   * List modules with optional filtering
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    params?: ListModulesParamsRequest
  ): Promise<PaginatedResponse<Module>> {
    return this.get<PaginatedResponse<Module>>(`/workspaces/${workspaceSlug}/projects/${projectId}/modules/`, params);
  }

  /**
   * List work items in module
   */
  async listWorkItemsInModule(
    workspaceSlug: string,
    projectId: string,
    moduleId: string,
    params?: any
  ): Promise<PaginatedResponse<WorkItem>> {
    return this.get<PaginatedResponse<WorkItem>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/module-issues/`,
      params
    );
  }

  /**
   * Add work items to module
   */
  async addWorkItemsToModule(
    workspaceSlug: string,
    projectId: string,
    moduleId: string,
    workItemIds: string[]
  ): Promise<void> {
    return this.post<void>(`/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/module-issues/`, {
      issues: workItemIds,
    });
  }

  /**
   * Delete work item from module
   */
  async removeWorkItemFromModule(
    workspaceSlug: string,
    projectId: string,
    moduleId: string,
    workItemId: string
  ): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/module-issues/${workItemId}/`
    );
  }

  /**
   * List archived modules
   */
  async listArchivedModules(
    workspaceSlug: string,
    projectId: string,
    params?: any
  ): Promise<PaginatedResponse<Module>> {
    return this.get<PaginatedResponse<Module>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/archived/`,
      params
    );
  }

  /**
   * Archive a module
   */
  async archiveModule(workspaceSlug: string, projectId: string, moduleId: string): Promise<void> {
    return this.post<void>(`/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/archive/`);
  }

  /**
   * Unarchive a module
   */
  async unArchiveModule(workspaceSlug: string, projectId: string, moduleId: string): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/archived-modules/${moduleId}/unarchive/`
    );
  }
}
