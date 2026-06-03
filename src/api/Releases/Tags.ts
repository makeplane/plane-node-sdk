import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateReleaseTag, ReleaseTag } from "../../models/Release";

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
}
