import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { WorkItem } from "../../models/WorkItem";
import { PaginatedResponse } from "../../models/common";
import {
  AddInitiativeWorkItemsRequest,
  ListInitiativeWorkItemsParams,
  RemoveInitiativeWorkItemsRequest,
} from "../../models/Initiative";

/**
 * Initiative Work Items API resource
 * Handles the work items associated with an initiative.
 *
 * This is the successor to `client.initiatives.epics`. The two surfaces share one implementation
 * server-side and one association model, so they behave identically; they differ only
 * in the URL and in the request field name (`work_item_ids` here, `epic_ids` there).
 * Any work item type is accepted -- the `/epics/` spelling reflects the old Epic-only
 * model and is deprecated.
 */
export class WorkItems extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List the work items associated with an initiative (paginated).
   *
   * Returns one page (20 by default). Pass `per_page`/`cursor` and follow
   * `next_cursor` to page through the rest.
   */
  async list(
    workspaceSlug: string,
    initiativeId: string,
    params?: ListInitiativeWorkItemsParams
  ): Promise<PaginatedResponse<WorkItem>> {
    return this.get<PaginatedResponse<WorkItem>>(
      `/workspaces/${workspaceSlug}/initiatives/${initiativeId}/work-items/`,
      params
    );
  }

  /**
   * Associate work items with an initiative.
   *
   * Work items already associated are skipped. The response covers every id
   * requested, not only the newly added ones.
   */
  async add(
    workspaceSlug: string,
    initiativeId: string,
    addWorkItems: AddInitiativeWorkItemsRequest
  ): Promise<WorkItem[]> {
    return this.post<WorkItem[]>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/work-items/`, addWorkItems);
  }

  /**
   * Remove work items from an initiative
   */
  async remove(
    workspaceSlug: string,
    initiativeId: string,
    removeWorkItems: RemoveInitiativeWorkItemsRequest
  ): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/work-items/`, removeWorkItems);
  }
}
