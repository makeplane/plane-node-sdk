import { Page } from "../../models/v2/common";
import { View, UpdateView, CreateView } from "../../models/v2/View";
import { OperationId, V2Resource } from "./kernel/resource";
import { ListProjectViewsParams, ViewExpand, ViewField, WorkspaceViewOrderBy } from "./Views";

/** {@link ListProjectViewsParams} minus its project-only `order_by` enum. */
export interface ListWorkspaceViewsParams extends Omit<ListProjectViewsParams, "order_by"> {
  order_by?: WorkspaceViewOrderBy;
}

/** Workspace-scoped saved views (`project IS NULL`) — a distinct resource from `ProjectViews`, not a filter on it. */
export class WorkspaceViews extends V2Resource<View, CreateView, UpdateView> {
  protected path = "/workspaces/{slug}/views/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_views_list",
    retrieve: "workspace_views_retrieve",
    create: "workspace_views_create",
    update: "workspace_views_partial_update",
    delete: "workspace_views_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ViewField, "all"> & keyof View>(
    params: ListWorkspaceViewsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<View, F | "id">>>;
  list(params?: ListWorkspaceViewsParams): Promise<Page<View>>;
  list(params?: ListWorkspaceViewsParams): Promise<Page<View>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every workspace view, following pages automatically. */
  iterate(params?: ListWorkspaceViewsParams): AsyncGenerator<View> {
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
