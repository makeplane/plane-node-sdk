import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";
import { Sticky, CreateSticky, UpdateSticky, ListStickiesParams } from "../models/Sticky";

/**
 * Sticky API resource
 * Handles all sticky related operations
 */
export class Stickies extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new sticky
   */
  async create(workspaceSlug: string, createSticky: CreateSticky): Promise<Sticky> {
    return this.post<Sticky>(`/workspaces/${workspaceSlug}/stickies/`, createSticky);
  }

  /**
   * Retrieve a sticky by ID
   */
  async retrieve(workspaceSlug: string, stickyId: string): Promise<Sticky> {
    return this.get<Sticky>(`/workspaces/${workspaceSlug}/stickies/${stickyId}/`);
  }

  /**
   * Update a sticky
   */
  async update(workspaceSlug: string, stickyId: string, updateSticky: UpdateSticky): Promise<Sticky> {
    return this.patch<Sticky>(`/workspaces/${workspaceSlug}/stickies/${stickyId}/`, updateSticky);
  }

  /**
   * Delete a sticky
   */
  async delete(workspaceSlug: string, stickyId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/stickies/${stickyId}/`);
  }

  /**
   * List stickies with optional filtering
   */
  async list(workspaceSlug: string, params?: ListStickiesParams): Promise<PaginatedResponse<Sticky>> {
    return this.get<PaginatedResponse<Sticky>>(`/workspaces/${workspaceSlug}/stickies/`, params);
  }
}
