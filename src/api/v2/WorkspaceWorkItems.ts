import { Page } from "../../models/v2/common";
import { WorkItem } from "../../models/v2/WorkItem";
import { UpdateWorkItemSubscribers, WorkItemSubscribers } from "../../models/v2/WorkItemSubscriber";
import { WorkItemExpand, WorkItemField } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";
import { ListWorkItemsParams } from "./WorkItems";

/** `?fields=`/`?expand=` on a single-row read. */
export interface WorkspaceWorkItemShapeParams {
  fields?: readonly WorkItemField[];
  expand?: readonly WorkItemExpand[];
}

/** Every work item across every project the caller can see; `list` and the by-identifier reads/writes only — everything else stays on `Project.workItems`. */
export class WorkspaceWorkItems extends V2Resource<WorkItem, never, never> {
  protected path = "/workspaces/{slug}/work-items/";
  // The readable-key route is a template of its own, not `{pk}` on the collection: the
  // key is composite (`ENG-12`) and the server resolves it, so `urlFor` builds this one.
  protected extraPaths = {
    retrieveByIdentifier: "/workspaces/{slug}/work-items/{identifier}/",
    retrieveSubscribersByIdentifier: "/workspaces/{slug}/work-items/{identifier}/subscribers/",
    updateSubscribersByIdentifier: "/workspaces/{slug}/work-items/{identifier}/subscribers/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_work_items_list",
    retrieveByIdentifier: "work_items_retrieve_by_identifier",
    retrieveSubscribersByIdentifier: "work_items_subscribers_retrieve_by_identifier",
    updateSubscribersByIdentifier: "work_items_subscribers_partial_update_by_identifier",
  };

  /**
   * One page of `WorkItem` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    params: ListWorkItemsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItem, F | "id">>>;
  /** One page of `WorkItem` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListWorkItemsParams): Promise<Page<WorkItem>>;
  list(slug: string, params?: ListWorkItemsParams): Promise<Page<WorkItem>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every work item in the workspace, following pages automatically. */
  iterate<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    params: Omit<ListWorkItemsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItem, F | "id">>;
  /** Every work item in the workspace, following pages automatically. */
  iterate(slug: string, params?: Omit<ListWorkItemsParams, "offset" | "count">): AsyncGenerator<WorkItem>;
  iterate(slug: string, params?: Omit<ListWorkItemsParams, "offset" | "count">): AsyncGenerator<WorkItem> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  /** Look a work item up by its composite human key (`ENG-12`), not its id. */
  retrieveByIdentifier<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    identifier: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemExpand[] }
  ): Promise<Pick<WorkItem, F | "id">>;
  /** Look a work item up by its composite human key (`ENG-12`), not its id. */
  retrieveByIdentifier(slug: string, identifier: string, params?: WorkspaceWorkItemShapeParams): Promise<WorkItem>;
  retrieveByIdentifier(slug: string, identifier: string, params?: WorkspaceWorkItemShapeParams): Promise<WorkItem> {
    return this.doRetrieveAt(
      this.urlFor("retrieveByIdentifier", { slug, identifier }),
      "retrieveByIdentifier",
      params as Record<string, unknown>
    );
  }

  /** `WorkItemSubscribersResource.retrieve` for a work item addressed by its key (`ENG-12`) or id. */
  retrieveSubscribersByIdentifier(slug: string, identifier: string): Promise<WorkItemSubscribers> {
    return this.doRetrieveSingleton({ slug, identifier }, "retrieveSubscribersByIdentifier");
  }

  /** `WorkItemSubscribersResource.update` for a work item addressed by its key (`ENG-12`) or id. */
  updateSubscribersByIdentifier(
    slug: string,
    identifier: string,
    data: UpdateWorkItemSubscribers
  ): Promise<WorkItemSubscribers> {
    return this.doUpdateSingleton(data, { slug, identifier }, "updateSubscribersByIdentifier");
  }
}
