import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { ReleaseLink, CreateReleaseLink, UpdateReleaseLink } from "../../models/Release";

/**
 * ReleaseLinks sub-resource
 * Manages external links attached to a release
 */
export class Links extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List links on a release
   */
  async list(workspaceSlug: string, releaseId: string, params?: any): Promise<ReleaseLink[]> {
    const data = await this.get<ReleaseLink[] | { results: ReleaseLink[] }>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/links/`,
      params
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Retrieve a single release link
   */
  async retrieve(workspaceSlug: string, releaseId: string, linkId: string): Promise<ReleaseLink> {
    return this.get<ReleaseLink>(`/workspaces/${workspaceSlug}/releases/${releaseId}/links/${linkId}/`);
  }

  /**
   * Create a link on a release
   */
  async create(workspaceSlug: string, releaseId: string, data: CreateReleaseLink): Promise<ReleaseLink> {
    return this.post<ReleaseLink>(`/workspaces/${workspaceSlug}/releases/${releaseId}/links/`, data);
  }

  /**
   * Update a release link
   */
  async update(
    workspaceSlug: string,
    releaseId: string,
    linkId: string,
    data: UpdateReleaseLink
  ): Promise<ReleaseLink> {
    return this.patch<ReleaseLink>(`/workspaces/${workspaceSlug}/releases/${releaseId}/links/${linkId}/`, data);
  }

  /**
   * Delete a release link
   */
  async delete(workspaceSlug: string, releaseId: string, linkId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/links/${linkId}/`);
  }
}
