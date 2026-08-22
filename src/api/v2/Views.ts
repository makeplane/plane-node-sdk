import { Page } from "../../models/v2/common";
import { View, ViewAccess, UpdateView, CreateView } from "../../models/v2/View";
import { EXPAND, FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type ViewField = (typeof FIELDS)["project_views_list"][number];
export type ProjectViewOrderBy = (typeof ORDER_BY)["project_views_list"][number];
export type WorkspaceViewOrderBy = (typeof ORDER_BY)["workspace_views_list"][number];
/** Only `"owned_by"` — replaces `owned_by_id` with the full member object. */
export type ViewExpand = (typeof EXPAND)["project_views_list"][number];

export interface ListProjectViewsParams {
  fields?: readonly ViewField[];
  expand?: readonly ViewExpand[];
  access?: ViewAccess;
  name?: string;
  is_locked?: boolean;
  owned_by_id?: string;
  search?: string;
  order_by?: ProjectViewOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/**
 * Saved work-item views for a project; the workspace-scoped sibling is `WorkspaceViews` at its own path.
 */
export class ProjectViews extends V2Resource<View, CreateView, UpdateView> {
  protected path = "/workspaces/{slug}/projects/{project_id}/views/";
  protected operations: Record<string, OperationId> = {
    list: "project_views_list",
    retrieve: "project_views_retrieve",
    create: "project_views_create",
    update: "project_views_partial_update",
    delete: "project_views_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ViewField, "all"> & keyof View>(
    params: ListProjectViewsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<View, F | "id">>>;
  list(params?: ListProjectViewsParams): Promise<Page<View>>;
  list(params?: ListProjectViewsParams): Promise<Page<View>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every project view, following pages automatically. */
  iterate(params?: ListProjectViewsParams): AsyncGenerator<View> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ViewField, "all"> & keyof View>(
    viewId: string,
    params: { fields: readonly F[]; expand?: readonly ViewExpand[] }
  ): Promise<Pick<View, F | "id">>;
  retrieve(viewId: string, params?: { fields?: readonly ViewField[]; expand?: readonly ViewExpand[] }): Promise<View>;
  retrieve(viewId: string, params?: { fields?: readonly ViewField[]; expand?: readonly ViewExpand[] }): Promise<View> {
    return this.doRetrieve({ pk: viewId }, params as Record<string, unknown>);
  }

  create(data: CreateView): Promise<View> {
    return this.doCreate(data, {});
  }

  update(viewId: string, data: UpdateView): Promise<View> {
    return this.doUpdate(data, { pk: viewId });
  }

  delete(viewId: string): Promise<void> {
    return this.doDelete({ pk: viewId });
  }
}
