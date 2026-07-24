import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { ReleaseChangelog, UpdateReleaseChangelog } from "../../models/Release";

/**
 * ReleaseChangelog sub-resource
 * Manages the changelog document attached to a release
 */
export class Changelog extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve the changelog for a release
   */
  async retrieve(workspaceSlug: string, releaseId: string): Promise<ReleaseChangelog> {
    return this.get<ReleaseChangelog>(`/workspaces/${workspaceSlug}/releases/${releaseId}/changelog/`);
  }

  /**
   * Update the changelog for a release
   */
  async update(workspaceSlug: string, releaseId: string, data: UpdateReleaseChangelog): Promise<ReleaseChangelog> {
    return this.patch<ReleaseChangelog>(`/workspaces/${workspaceSlug}/releases/${releaseId}/changelog/`, data);
  }
}
