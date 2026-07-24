import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateReleaseLabel, ReleaseLabel, UpdateReleaseLabel } from "../../models/Release";

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

  async retrieve(workspaceSlug: string, labelId: string): Promise<ReleaseLabel> {
    return this.get<ReleaseLabel>(`/workspaces/${workspaceSlug}/releases/labels/${labelId}/`);
  }

  async update(workspaceSlug: string, labelId: string, data: UpdateReleaseLabel): Promise<ReleaseLabel> {
    return this.patch<ReleaseLabel>(`/workspaces/${workspaceSlug}/releases/labels/${labelId}/`, data);
  }

  async delete(workspaceSlug: string, labelId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/labels/${labelId}/`);
  }
}
