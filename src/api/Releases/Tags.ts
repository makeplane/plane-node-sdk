import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { ReleaseTag, CreateReleaseTag, UpdateReleaseTag, ListReleaseTagsParams } from "../../models/ReleaseTag";
import { PaginatedResponse } from "../../models/common";

/**
 * Release Tags API resource
 * Handles workspace-level release tag (version identifier) CRUD.
 */
export class Tags extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new release tag
   */
  async create(workspaceSlug: string, createReleaseTag: CreateReleaseTag): Promise<ReleaseTag> {
    return this.post<ReleaseTag>(`/workspaces/${workspaceSlug}/releases/tags/`, createReleaseTag);
  }

  /**
   * Retrieve a release tag by ID
   */
  async retrieve(workspaceSlug: string, releaseTagId: string): Promise<ReleaseTag> {
    return this.get<ReleaseTag>(`/workspaces/${workspaceSlug}/releases/tags/${releaseTagId}/`);
  }

  /**
   * Update a release tag
   */
  async update(workspaceSlug: string, releaseTagId: string, updateReleaseTag: UpdateReleaseTag): Promise<ReleaseTag> {
    return this.patch<ReleaseTag>(`/workspaces/${workspaceSlug}/releases/tags/${releaseTagId}/`, updateReleaseTag);
  }

  /**
   * Delete a release tag
   */
  async delete(workspaceSlug: string, releaseTagId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/tags/${releaseTagId}/`);
  }

  /**
   * List release tags with optional filtering
   */
  async list(workspaceSlug: string, params?: ListReleaseTagsParams): Promise<PaginatedResponse<ReleaseTag>> {
    return this.get<PaginatedResponse<ReleaseTag>>(`/workspaces/${workspaceSlug}/releases/tags/`, params);
  }
}
