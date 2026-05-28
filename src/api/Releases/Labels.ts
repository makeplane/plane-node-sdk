import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateReleaseLabel, ReleaseLabel } from "../../models/Release";

/**
 * ReleaseLabels sub-resource
 * Manages release labels at the workspace level
 */
export class Labels extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string): Promise<ReleaseLabel[]> {
    const data = await this.get<ReleaseLabel[] | { results: ReleaseLabel[] }>(
      `/workspaces/${workspaceSlug}/releases/labels/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateReleaseLabel): Promise<ReleaseLabel> {
    return this.post<ReleaseLabel>(`/workspaces/${workspaceSlug}/releases/labels/`, data);
  }
}
