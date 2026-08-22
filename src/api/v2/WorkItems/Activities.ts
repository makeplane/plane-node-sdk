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
  count?: boolean;
}

/** The audit log for a work item. Read-only — `list`/`retrieve` only. */
export class Activities extends V2Resource<WorkItemActivity, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/activities/";
  protected operations: Record<string, OperationId> = {
    list: "activities_list",
    retrieve: "activities_retrieve",
  };

  private pk(workItemId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { work_item_id: workItemId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemActivityField, "all"> & keyof WorkItemActivity>(
    workItemId: string,
    params: ListWorkItemActivitiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemActivity, F | "id">>>;
  list(workItemId: string, params?: ListWorkItemActivitiesParams): Promise<Page<WorkItemActivity>>;
  list(workItemId: string, params?: ListWorkItemActivitiesParams): Promise<Page<WorkItemActivity>> {
    return this.doList(this.pk(workItemId), params as Record<string, unknown>);
  }

  /** Every activity, following pages automatically. */
  iterate(workItemId: string, params?: ListWorkItemActivitiesParams): AsyncGenerator<WorkItemActivity> {
    return this.doIterate(this.pk(workItemId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemActivityField, "all"> & keyof WorkItemActivity>(
    workItemId: string,
    activityId: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemActivityExpand[] }
  ): Promise<Pick<WorkItemActivity, F | "id">>;
  retrieve(
    workItemId: string,
    activityId: string,
    params?: { fields?: readonly WorkItemActivityField[]; expand?: readonly WorkItemActivityExpand[] }
  ): Promise<WorkItemActivity>;
  retrieve(
    workItemId: string,
    activityId: string,
    params?: { fields?: readonly WorkItemActivityField[]; expand?: readonly WorkItemActivityExpand[] }
  ): Promise<WorkItemActivity> {
    return this.doRetrieve(this.pk(workItemId, activityId), params as Record<string, unknown>);
  }
}
