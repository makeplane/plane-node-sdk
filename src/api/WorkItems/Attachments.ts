import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  WorkItemAttachment,
  WorkItemAttachmentUploadRequest,
  UpdateWorkItemAttachmentRequest,
} from "../../models/Attachment";

/**
 * WorkItemAttachments API resource
 * Handles all work item attachment operations
 */
export class Attachments extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve an attachment by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    attachmentId: string
  ): Promise<WorkItemAttachment> {
    return this.get<WorkItemAttachment>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/attachments/${attachmentId}/`
    );
  }

  /**
   * List attachments for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    params?: any
  ): Promise<WorkItemAttachment[]> {
    return this.get<WorkItemAttachment[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/attachments/`,
      params
    );
  }

  /**
   * Create/upload an attachment for a work item
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    uploadData: WorkItemAttachmentUploadRequest
  ): Promise<WorkItemAttachment> {
    return this.post<WorkItemAttachment>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/attachments/`,
      uploadData
    );
  }

  /**
   * Update an attachment
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    attachmentId: string,
    updateData: UpdateWorkItemAttachmentRequest
  ): Promise<WorkItemAttachment> {
    return this.patch<WorkItemAttachment>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/attachments/${attachmentId}/`,
      updateData
    );
  }

  /**
   * Delete an attachment
   */
  async delete(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    attachmentId: string
  ): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/attachments/${attachmentId}/`
    );
  }
}
