import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { AddReleaseItemLabel, ReleaseLabel } from "../../models/Release";

/**
 * ReleaseItemLabels sub-resource
 * Manages labels assigned to a specific release
 */
export class ItemLabels extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string, releaseId: string): Promise<ReleaseLabel[]> {
    const data = await this.get<ReleaseLabel[] | { results: ReleaseLabel[] }>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/labels/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, releaseId: string, data: AddReleaseItemLabel): Promise<ReleaseLabel[]> {
    const result = await this.post<ReleaseLabel[] | { results: ReleaseLabel[] }>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/labels/`,
      data
    );
    return Array.isArray(result) ? result : result.results;
  }

  /**
   * Detach labels from a release. The API takes the label ids in the request
   * body (DELETE .../releases/{releaseId}/labels/) — there is no per-label path.
   */
  async delete(workspaceSlug: string, releaseId: string, labelIds: string[]): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/labels/`, {
      label_ids: labelIds,
    });
  }

  /**
   * @deprecated Use delete(workspaceSlug, releaseId, [labelId]) — the API
   * removes labels via ids in the request body, not a per-label path.
   */
  async del(workspaceSlug: string, releaseId: string, labelId: string): Promise<void> {
    return this.delete(workspaceSlug, releaseId, [labelId]);
  }
}
