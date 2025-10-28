import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { Link, CreateLink, UpdateLink, ListLinksParams } from "../models/Link";

/**
 * Links API resource
 * Handles all link related operations for work items
 */
export class Links extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new link for a work item
   */
  async create(workspaceSlug: string, projectId: string, issueId: string, createLink: CreateLink): Promise<Link> {
    return this.post<Link>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${issueId}/links/`,
      createLink
    );
  }

  /**
   * Retrieve a link by ID
   */
  async retrieve(workspaceSlug: string, projectId: string, issueId: string, linkId: string): Promise<Link> {
    return this.get<Link>(`/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${issueId}/links/${linkId}/`);
  }

  /**
   * Update a link
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    linkId: string,
    updateLink: UpdateLink
  ): Promise<Link> {
    return this.patch<Link>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${issueId}/links/${linkId}/`,
      updateLink
    );
  }

  /**
   * Delete a link
   */
  async delete(workspaceSlug: string, projectId: string, issueId: string, linkId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${issueId}/links/${linkId}/`);
  }

  /**
   * List links for a work item with optional filtering
   */
  async list(workspaceSlug: string, projectId: string, issueId: string, params?: ListLinksParams): Promise<Link[]> {
    return this.get<Link[]>(`/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${issueId}/links/`, params);
  }
}
