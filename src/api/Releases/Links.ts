import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { ReleaseLink, CreateReleaseLink, UpdateReleaseLink, ListReleaseLinksParams } from "../../models/ReleaseLink";
import { PaginatedResponse } from "../../models/common";

/**
 * Release Links API resource
 * Handles external links attached to a specific release.
 */
export class Links extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a link on a release
   */
  async create(workspaceSlug: string, releaseId: string, createReleaseLink: CreateReleaseLink): Promise<ReleaseLink> {
    return this.post<ReleaseLink>(`/workspaces/${workspaceSlug}/releases/${releaseId}/links/`, createReleaseLink);
  }

  /**
   * Retrieve a release link by ID
   */
  async retrieve(workspaceSlug: string, releaseId: string, linkId: string): Promise<ReleaseLink> {
    return this.get<ReleaseLink>(`/workspaces/${workspaceSlug}/releases/${releaseId}/links/${linkId}/`);
  }

  /**
   * Update a release link
   */
  async update(
    workspaceSlug: string,
    releaseId: string,
    linkId: string,
    updateReleaseLink: UpdateReleaseLink
  ): Promise<ReleaseLink> {
    return this.patch<ReleaseLink>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/links/${linkId}/`,
      updateReleaseLink
    );
  }

  /**
   * Delete a release link
   */
  async delete(workspaceSlug: string, releaseId: string, linkId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/links/${linkId}/`);
  }

  /**
   * List links on a release
   */
  async list(
    workspaceSlug: string,
    releaseId: string,
    params?: ListReleaseLinksParams
  ): Promise<PaginatedResponse<ReleaseLink>> {
    return this.get<PaginatedResponse<ReleaseLink>>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/links/`,
      params
    );
  }
}
