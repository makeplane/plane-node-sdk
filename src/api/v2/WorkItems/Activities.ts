import { Page } from "../../../models/v2/common";
import { WorkItemActivity } from "../../../models/v2/WorkItemActivity";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkItemActivityField = (typeof FIELDS)["activities_list"][number];
export type WorkItemActivityOrderBy = (typeof ORDER_BY)["activities_list"][number];
/** Only `"actor"`. */
export type WorkItemActivityExpand = (typeof EXPAND)["activities_list"][number];

export interface ListWorkItemActivitiesParams {
  fields?: readonly WorkItemActivityField[];
  actor_id?: string;
  field?: string;
  verb?: string;
  search?: string;
  created_at__gte?: string;
  created_at__lte?: string;
  expand?: readonly WorkItemActivityExpand[];
  order_by?: WorkItemActivityOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read. */
export interface WorkItemActivityShapeParams {
  fields?: readonly WorkItemActivityField[];
  expand?: readonly WorkItemActivityExpand[];
}

/** The audit log for a work item. Read-only — `list`/`retrieve` only. */
export class Activities extends V2Resource<WorkItemActivity, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/activities/";
  protected operations: Record<string, OperationId> = {
    list: "activities_list",
    retrieve: "activities_retrieve",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemActivityField, "all"> & keyof WorkItemActivity>(
    slug: string,
    project: string,
    workItem: string,
    params: ListWorkItemActivitiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemActivity, F | "id">>>;
  list(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemActivitiesParams
  ): Promise<Page<WorkItemActivity>>;
  list(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemActivitiesParams
  ): Promise<Page<WorkItemActivity>> {
    return this.doList({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  /** Every activity, following pages automatically. */
  iterate<F extends Exclude<WorkItemActivityField, "all"> & keyof WorkItemActivity>(
    slug: string,
    project: string,
    workItem: string,
    params: Omit<ListWorkItemActivitiesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemActivity, F | "id">>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: Omit<ListWorkItemActivitiesParams, "offset" | "count">
  ): AsyncGenerator<WorkItemActivity>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: Omit<ListWorkItemActivitiesParams, "offset" | "count">
  ): AsyncGenerator<WorkItemActivity> {
    return this.doIterate({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemActivityField, "all"> & keyof WorkItemActivity>(
    slug: string,
    project: string,
    workItem: string,
    activity: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemActivityExpand[] }
  ): Promise<Pick<WorkItemActivity, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    activity: string,
    params?: WorkItemActivityShapeParams
  ): Promise<WorkItemActivity>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    activity: string,
    params?: WorkItemActivityShapeParams
  ): Promise<WorkItemActivity> {
    return this.doRetrieve(
      { slug, project_id: project, work_item_id: workItem, pk: activity },
      params as Record<string, unknown>
    );
  }
}
