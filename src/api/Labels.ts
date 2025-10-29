import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";

/**
 * Label model interfaces
 */
export interface Label {
  id: string;
  name: string;
  color?: string;
  description?: string;
  project: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLabel {
  name: string;
  color?: string;
  description?: string;
}

export interface UpdateLabel {
  name?: string;
  color?: string;
  description?: string;
}

export interface ListLabelsParams {
  project?: string;
  limit?: number;
  offset?: number;
}

/**
 * Labels API resource
 * Handles all label related operations
 */
export class Labels extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new label
   */
  async create(workspaceSlug: string, projectId: string, createLabel: CreateLabel): Promise<Label> {
    return this.post<Label>(`/workspaces/${workspaceSlug}/projects/${projectId}/labels/`, createLabel);
  }

  /**
   * Retrieve a label by ID
   */
  async retrieve(workspaceSlug: string, projectId: string, labelId: string): Promise<Label> {
    return this.get<Label>(`/workspaces/${workspaceSlug}/projects/${projectId}/labels/${labelId}/`);
  }

  /**
   * Update a label
   */
  async update(workspaceSlug: string, projectId: string, labelId: string, updateLabel: UpdateLabel): Promise<Label> {
    return this.patch<Label>(`/workspaces/${workspaceSlug}/projects/${projectId}/labels/${labelId}/`, updateLabel);
  }

  /**
   * Delete a label
   */
  async delete(workspaceSlug: string, projectId: string, labelId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/labels/${labelId}/`);
  }

  /**
   * List labels with optional filtering
   */
  async list(workspaceSlug: string, projectId: string, params?: ListLabelsParams): Promise<PaginatedResponse<Label>> {
    return this.get<PaginatedResponse<Label>>(`/workspaces/${workspaceSlug}/projects/${projectId}/labels/`, params);
  }
}
