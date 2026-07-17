import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  ReleaseWorkItem,
  AddReleaseWorkItemsRequest,
  RemoveReleaseWorkItemsRequest,
  AddReleaseWorkItemsResponse,
} from "../../models/Release";
import { PaginatedResponse } from "../../models/common";

/**
 * Release Work Items API resource
 * Handles the work item relationships on a release. Work items can be pulled in
 * from multiple projects across the workspace.
 */
export class WorkItems extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List work items in a release
   */
  async list(
    workspaceSlug: string,
    releaseId: string,
    params?: { per_page?: number; cursor?: string; [key: string]: any }
  ): Promise<PaginatedResponse<ReleaseWorkItem>> {
    return this.get<PaginatedResponse<ReleaseWorkItem>>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/work-items/`,
      params
    );
  }

  /**
   * Add work items to a release
   */
  async add(
    workspaceSlug: string,
    releaseId: string,
    addWorkItems: AddReleaseWorkItemsRequest
  ): Promise<AddReleaseWorkItemsResponse> {
    return this.post<AddReleaseWorkItemsResponse>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/work-items/`,
      addWorkItems
    );
  }

  /**
   * Remove work items from a release
   */
  async remove(
    workspaceSlug: string,
    releaseId: string,
    removeWorkItems: RemoveReleaseWorkItemsRequest
  ): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/work-items/`, removeWorkItems);
  }
}
