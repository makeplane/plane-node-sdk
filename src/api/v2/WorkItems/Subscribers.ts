import { UpdateWorkItemSubscribers, WorkItemSubscribers } from "../../../models/v2/WorkItemSubscriber";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/**
 * Who is subscribed to a work item — a singleton list on the work item, read with
 * `retrieve` and changed with `update` (`{add, remove}`), which answers the resulting list.
 * To address the work item by its key (`ENG-12`) without its project, use
 * `WorkspaceWorkItems.retrieveSubscribersByIdentifier`/`updateSubscribersByIdentifier`.
 */
export class Subscribers extends V2Resource<WorkItemSubscribers, never, UpdateWorkItemSubscribers> {
  /** Exported from the v2 barrel as `WorkItemSubscribersResource`; `exported-names.test.ts` pins the two together. */
  static readonly publicName = "WorkItemSubscribersResource";

  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/subscribers/";
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "work_items_subscribers_retrieve",
    update: "work_items_subscribers_partial_update",
  };

  /** The users subscribed to this work item. */
  retrieve(slug: string, project: string, workItem: string): Promise<WorkItemSubscribers> {
    return this.doRetrieveSingleton({ slug, project_id: project, work_item_id: workItem });
  }

  /** Subscribe `data.add` and unsubscribe `data.remove`; answers the resulting list. */
  update(
    slug: string,
    project: string,
    workItem: string,
    data: UpdateWorkItemSubscribers
  ): Promise<WorkItemSubscribers> {
    return this.doUpdateSingleton(data, { slug, project_id: project, work_item_id: workItem });
  }
}
