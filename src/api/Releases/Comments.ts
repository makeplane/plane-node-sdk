import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { ReleaseComment, CreateReleaseComment, UpdateReleaseComment } from "../../models/Release";

/**
 * ReleaseComments sub-resource
 * Manages comments on a release
 */
export class Comments extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List comments on a release
   */
  async list(workspaceSlug: string, releaseId: string, params?: any): Promise<ReleaseComment[]> {
    const data = await this.get<ReleaseComment[] | { results: ReleaseComment[] }>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/comments/`,
      params
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Retrieve a single release comment
   */
  async retrieve(workspaceSlug: string, releaseId: string, commentId: string): Promise<ReleaseComment> {
    return this.get<ReleaseComment>(`/workspaces/${workspaceSlug}/releases/${releaseId}/comments/${commentId}/`);
  }

  /**
   * Create a comment on a release
   */
  async create(workspaceSlug: string, releaseId: string, data: CreateReleaseComment): Promise<ReleaseComment> {
    return this.post<ReleaseComment>(`/workspaces/${workspaceSlug}/releases/${releaseId}/comments/`, data);
  }

  /**
   * Update a release comment
   */
  async update(
    workspaceSlug: string,
    releaseId: string,
    commentId: string,
    data: UpdateReleaseComment
  ): Promise<ReleaseComment> {
    return this.patch<ReleaseComment>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/comments/${commentId}/`,
      data
    );
  }

  /**
   * Delete a release comment
   */
  async delete(workspaceSlug: string, releaseId: string, commentId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/comments/${commentId}/`);
  }
}
