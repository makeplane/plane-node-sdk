import { Page } from "../../../models/v2/common";
import { WorkItemWorklog, UpdateWorkItemWorklog, CreateWorkItemWorklog } from "../../../models/v2/WorkItemWorklog";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkItemWorklogField = (typeof FIELDS)["worklogs_list"][number];
export type WorkItemWorklogOrderBy = (typeof ORDER_BY)["worklogs_list"][number];
/** Only `"logged_by"`. */
export type WorkItemWorklogExpand = (typeof EXPAND)["worklogs_list"][number];

export interface ListWorkItemWorklogsParams {
  fields?: readonly WorkItemWorklogField[];
  logged_by_id?: string;
  duration__gte?: number;
  duration__lte?: number;
  search?: string;
  expand?: readonly WorkItemWorklogExpand[];
  order_by?: WorkItemWorklogOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Logged-time entries on a work item (api_v2). Named `WorkLogs`, not `Worklogs`, to match the v1 sub-resource idiom. */
export class WorkLogs extends V2Resource<WorkItemWorklog, CreateWorkItemWorklog, UpdateWorkItemWorklog> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/worklogs/";
  protected operations: Record<string, OperationId> = {
    list: "worklogs_list",
    retrieve: "worklogs_retrieve",
    create: "worklogs_create",
    update: "worklogs_partial_update",
    delete: "worklogs_destroy",
  };

  private pk(workItemId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { work_item_id: workItemId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemWorklogField, "all"> & keyof WorkItemWorklog>(
    workItemId: string,
    params: ListWorkItemWorklogsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemWorklog, F | "id">>>;
  list(workItemId: string, params?: ListWorkItemWorklogsParams): Promise<Page<WorkItemWorklog>>;
  list(workItemId: string, params?: ListWorkItemWorklogsParams): Promise<Page<WorkItemWorklog>> {
    return this.doList(this.pk(workItemId), params as Record<string, unknown>);
  }

  /** Every worklog, following pages automatically. */
  iterate(workItemId: string, params?: ListWorkItemWorklogsParams): AsyncGenerator<WorkItemWorklog> {
    return this.doIterate(this.pk(workItemId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemWorklogField, "all"> & keyof WorkItemWorklog>(
    workItemId: string,
    worklogId: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemWorklogExpand[] }
  ): Promise<Pick<WorkItemWorklog, F | "id">>;
  retrieve(
    workItemId: string,
    worklogId: string,
    params?: { fields?: readonly WorkItemWorklogField[]; expand?: readonly WorkItemWorklogExpand[] }
  ): Promise<WorkItemWorklog>;
  retrieve(
    workItemId: string,
    worklogId: string,
    params?: { fields?: readonly WorkItemWorklogField[]; expand?: readonly WorkItemWorklogExpand[] }
  ): Promise<WorkItemWorklog> {
    return this.doRetrieve(this.pk(workItemId, worklogId), params as Record<string, unknown>);
  }

  create(
    workItemId: string,
    data: CreateWorkItemWorklog,
    params?: { fields?: readonly WorkItemWorklogField[]; expand?: readonly WorkItemWorklogExpand[] }
  ): Promise<WorkItemWorklog> {
    return this.doCreate(data, this.pk(workItemId), params as Record<string, unknown>);
  }

  update(
    workItemId: string,
    worklogId: string,
    data: UpdateWorkItemWorklog,
    params?: { fields?: readonly WorkItemWorklogField[]; expand?: readonly WorkItemWorklogExpand[] }
  ): Promise<WorkItemWorklog> {
    return this.doUpdate(data, this.pk(workItemId, worklogId), params as Record<string, unknown>);
  }

  delete(workItemId: string, worklogId: string): Promise<void> {
    return this.doDelete(this.pk(workItemId, worklogId));
  }
}
