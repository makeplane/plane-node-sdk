import { BaseResource } from './BaseResource';
import { Configuration } from '../Configuration';
import { PaginatedResponse } from '../models/common';
import { WorkItem } from '../models/schema-types';

/**
 * Module model interfaces
 */
export interface Module {
  id: string;
  name: string;
  description?: string;
  project: string;
  lead?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateModule {
  name: string;
  description?: string;
  project: string;
  lead?: string;
}

export interface UpdateModule {
  name?: string;
  description?: string;
  lead?: string;
}

export interface ListModulesParams {
  project?: string;
  lead?: string;
  limit?: number;
  offset?: number;
}

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
  async create(
    workspaceSlug: string,
    projectId: string,
    createModule: CreateModule
  ): Promise<Module> {
    return this.post<Module>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/`,
      createModule
    );
  }

  /**
   * Retrieve a module by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    moduleId: string
  ): Promise<Module> {
    return this.get<Module>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/`
    );
  }

  /**
   * Update a module
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    moduleId: string,
    updateModule: UpdateModule
  ): Promise<Module> {
    return this.patch<Module>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/`,
      updateModule
    );
  }

  /**
   * Delete a module
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    moduleId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/`
    );
  }

  /**
   * List modules with optional filtering
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    params?: ListModulesParams
  ): Promise<PaginatedResponse<Module>> {
    return this.get<PaginatedResponse<Module>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/`,
      params
    );
  }

  /**
   * Add work item to module
   */
  async addWorkItemToModule(
    workspaceSlug: string,
    projectId: string,
    moduleId: string,
    workItemIds: string[]
  ): Promise<void> {
    return this.post<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/work-items/`,
      { issues: workItemIds }
    );
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
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/work-items/`,
      params
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
  async archiveModule(
    workspaceSlug: string,
    projectId: string,
    moduleId: string
  ): Promise<void> {
    return this.post<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/archive/`
    );
  }

  /**
   * Unarchive a module
   */
  async unArchiveModule(
    workspaceSlug: string,
    projectId: string,
    moduleId: string
  ): Promise<void> {
    return this.post<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/modules/${moduleId}/unarchive/`
    );
  }
}
