import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  WorkItemComment,
  WorkItemCommentCreateRequest,
  WorkItemCommentUpdateRequest,
} from "../../models/Comment";

/**
 * WorkItemComments API resource
 * Handles all work item comment operations
 */
export class Comments extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve a comment by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    commentId: string
  ): Promise<WorkItemComment> {
    return this.get<WorkItemComment>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/comments/${commentId}/`
    );
  }

  /**
   * List comments for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    params?: any
  ): Promise<WorkItemComment[]> {
    return this.get<WorkItemComment[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/comments/`,
      params
    );
  }

  /**
   * Create a comment for a work item
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    commentData: WorkItemCommentCreateRequest
  ): Promise<WorkItemComment> {
    return this.post<WorkItemComment>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/comments/`,
      commentData
    );
  }

  /**
   * Update a comment
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    commentId: string,
    updateData: WorkItemCommentUpdateRequest
  ): Promise<WorkItemComment> {
    return this.patch<WorkItemComment>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/comments/${commentId}/`,
      updateData
    );
  }

  /**
   * Delete a comment
   */
  async delete(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    commentId: string
  ): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/comments/${commentId}/`
    );
  }
}
