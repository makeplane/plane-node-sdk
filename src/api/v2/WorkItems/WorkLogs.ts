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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface WorkItemWorklogShapeParams {
  fields?: readonly WorkItemWorklogField[];
  expand?: readonly WorkItemWorklogExpand[];
}

/** Logged-time entries on a work item. Named `WorkLogs`, not `Worklogs`, to match the v1 sub-resource idiom. */
export class WorkLogs extends V2Resource<WorkItemWorklog, CreateWorkItemWorklog, UpdateWorkItemWorklog> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/worklogs/";
  protected operations: Record<string, OperationId> = {
    list: "worklogs_list",
    retrieve: "worklogs_retrieve",
    create: "worklogs_create",
    update: "worklogs_partial_update",
    delete: "worklogs_destroy",
  };

  /**
   * One page of `WorkItemWorklog` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WorkItemWorklogField, "all"> & keyof WorkItemWorklog>(
    slug: string,
    project: string,
    workItem: string,
    params: ListWorkItemWorklogsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemWorklog, F | "id">>>;
  /** One page of `WorkItemWorklog` rows. Use `iterate` to follow pages automatically. */
  list(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemWorklogsParams
  ): Promise<Page<WorkItemWorklog>>;
  list(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemWorklogsParams
  ): Promise<Page<WorkItemWorklog>> {
    return this.doList({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  /** Every worklog, following pages automatically. */
  iterate<F extends Exclude<WorkItemWorklogField, "all"> & keyof WorkItemWorklog>(
    slug: string,
    project: string,
    workItem: string,
    params: Omit<ListWorkItemWorklogsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemWorklog, F | "id">>;
  /** Every worklog, following pages automatically. */
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: Omit<ListWorkItemWorklogsParams, "offset" | "count">
  ): AsyncGenerator<WorkItemWorklog>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: Omit<ListWorkItemWorklogsParams, "offset" | "count">
  ): AsyncGenerator<WorkItemWorklog> {
    return this.doIterate({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemWorklogField, "all"> & keyof WorkItemWorklog>(
    slug: string,
    project: string,
    workItem: string,
    worklog: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemWorklogExpand[] }
  ): Promise<Pick<WorkItemWorklog, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    worklog: string,
    params?: WorkItemWorklogShapeParams
  ): Promise<WorkItemWorklog>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    worklog: string,
    params?: WorkItemWorklogShapeParams
  ): Promise<WorkItemWorklog> {
    return this.doRetrieve(
      { slug, project_id: project, work_item_id: workItem, pk: worklog },
      params as Record<string, unknown>
    );
  }

  create<F extends Exclude<WorkItemWorklogField, "all"> & keyof WorkItemWorklog>(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemWorklog,
    params: WorkItemWorklogShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemWorklog, F | "id">>;
  create(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemWorklog,
    params?: WorkItemWorklogShapeParams
  ): Promise<WorkItemWorklog>;
  create(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemWorklog,
    params?: WorkItemWorklogShapeParams
  ): Promise<WorkItemWorklog> {
    return this.doCreate(
      data,
      { slug, project_id: project, work_item_id: workItem },
      params as Record<string, unknown>
    );
  }

  update<F extends Exclude<WorkItemWorklogField, "all"> & keyof WorkItemWorklog>(
    slug: string,
    project: string,
    workItem: string,
    worklog: string,
    data: UpdateWorkItemWorklog,
    params: WorkItemWorklogShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemWorklog, F | "id">>;
  update(
    slug: string,
    project: string,
    workItem: string,
    worklog: string,
    data: UpdateWorkItemWorklog,
    params?: WorkItemWorklogShapeParams
  ): Promise<WorkItemWorklog>;
  update(
    slug: string,
    project: string,
    workItem: string,
    worklog: string,
    data: UpdateWorkItemWorklog,
    params?: WorkItemWorklogShapeParams
  ): Promise<WorkItemWorklog> {
    return this.doUpdate(
      data,
      { slug, project_id: project, work_item_id: workItem, pk: worklog },
      params as Record<string, unknown>
    );
  }

  delete(slug: string, project: string, workItem: string, worklog: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, work_item_id: workItem, pk: worklog });
  }
}
