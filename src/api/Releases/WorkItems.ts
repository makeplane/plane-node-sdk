import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { ReleaseWorkItem } from "../../models/Release";

/**
 * ReleaseWorkItems sub-resource
 * Manages the work items attached to a release
 */
export class WorkItems extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List work items attached to a release
   */
  async list(workspaceSlug: string, releaseId: string, params?: any): Promise<ReleaseWorkItem[]> {
    const data = await this.get<ReleaseWorkItem[] | { results: ReleaseWorkItem[] }>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/work-items/`,
      params
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Attach work items to a release
   */
  async create(workspaceSlug: string, releaseId: string, workItemIds: string[]): Promise<void> {
    await this.post<void>(`/workspaces/${workspaceSlug}/releases/${releaseId}/work-items/`, {
      work_item_ids: workItemIds,
    });
  }

  /**
   * Detach work items from a release (ids in body)
   */
  async delete(workspaceSlug: string, releaseId: string, workItemIds: string[]): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/work-items/`, {
      work_item_ids: workItemIds,
    });
  }
}
