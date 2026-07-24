import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateReleaseTag, ReleaseTag, UpdateReleaseTag } from "../../models/Release";

/**
 * ReleaseTags sub-resource
 * Manages release tags at the workspace level
 */
export class Tags extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string): Promise<ReleaseTag[]> {
    const data = await this.get<ReleaseTag[] | { results: ReleaseTag[] }>(
      `/workspaces/${workspaceSlug}/releases/tags/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateReleaseTag): Promise<ReleaseTag> {
    return this.post<ReleaseTag>(`/workspaces/${workspaceSlug}/releases/tags/`, data);
  }

  async retrieve(workspaceSlug: string, tagId: string): Promise<ReleaseTag> {
    return this.get<ReleaseTag>(`/workspaces/${workspaceSlug}/releases/tags/${tagId}/`);
  }

  async update(workspaceSlug: string, tagId: string, data: UpdateReleaseTag): Promise<ReleaseTag> {
    return this.patch<ReleaseTag>(`/workspaces/${workspaceSlug}/releases/tags/${tagId}/`, data);
  }

  async delete(workspaceSlug: string, tagId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/tags/${tagId}/`);
  }
}
