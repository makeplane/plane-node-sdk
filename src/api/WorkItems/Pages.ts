import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { PaginatedResponse } from "../../models/common";
import { WorkItemPage, CreateWorkItemPageRequest } from "../../models/WorkItemPage";

/**
 * WorkItemPages API resource
 * Manages page links on a work item
 */
export class Pages extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List page links for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    params?: any
  ): Promise<PaginatedResponse<WorkItemPage>> {
    return this.get<PaginatedResponse<WorkItemPage>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/pages/`,
      params
    );
  }

  /**
   * Retrieve a specific page link for a work item
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    workItemPageId: string
  ): Promise<WorkItemPage> {
    return this.get<WorkItemPage>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/pages/${workItemPageId}/`
    );
  }

  /**
   * Link a page to a work item
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    createPage: CreateWorkItemPageRequest
  ): Promise<WorkItemPage> {
    return this.post<WorkItemPage>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/pages/`,
      createPage
    );
  }

  /**
   * Remove a page link from a work item
   */
  async delete(workspaceSlug: string, projectId: string, workItemId: string, workItemPageId: string): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/pages/${workItemPageId}/`
    );
  }
}
