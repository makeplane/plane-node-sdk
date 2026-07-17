import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  ReleaseComment,
  CreateReleaseComment,
  UpdateReleaseComment,
  ListReleaseCommentsParams,
} from "../../models/ReleaseComment";
import { PaginatedResponse } from "../../models/common";

/**
 * Release Comments API resource
 * Handles comments on a specific release.
 */
export class Comments extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a comment on a release
   */
  async create(
    workspaceSlug: string,
    releaseId: string,
    createReleaseComment: CreateReleaseComment
  ): Promise<ReleaseComment> {
    return this.post<ReleaseComment>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/comments/`,
      createReleaseComment
    );
  }

  /**
   * Retrieve a release comment by ID
   */
  async retrieve(workspaceSlug: string, releaseId: string, commentId: string): Promise<ReleaseComment> {
    return this.get<ReleaseComment>(`/workspaces/${workspaceSlug}/releases/${releaseId}/comments/${commentId}/`);
  }

  /**
   * Update a release comment
   */
  async update(
    workspaceSlug: string,
    releaseId: string,
    commentId: string,
    updateReleaseComment: UpdateReleaseComment
  ): Promise<ReleaseComment> {
    return this.patch<ReleaseComment>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/comments/${commentId}/`,
      updateReleaseComment
    );
  }

  /**
   * Delete a release comment
   */
  async delete(workspaceSlug: string, releaseId: string, commentId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/comments/${commentId}/`);
  }

  /**
   * List comments on a release
   */
  async list(
    workspaceSlug: string,
    releaseId: string,
    params?: ListReleaseCommentsParams
  ): Promise<PaginatedResponse<ReleaseComment>> {
    return this.get<PaginatedResponse<ReleaseComment>>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/comments/`,
      params
    );
  }
}
