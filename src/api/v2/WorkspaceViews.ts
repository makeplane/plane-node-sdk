import { Page } from "../../models/v2/common";
import { View, UpdateView, CreateView } from "../../models/v2/View";
import { OperationId, V2Resource } from "./kernel/resource";
import { ListProjectViewsParams, ViewExpand, ViewField, ViewShapeParams, WorkspaceViewOrderBy } from "./Views";

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
    slug: string,
    params: ListWorkspaceViewsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<View, F | "id">>>;
  list(slug: string, params?: ListWorkspaceViewsParams): Promise<Page<View>>;
  list(slug: string, params?: ListWorkspaceViewsParams): Promise<Page<View>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every workspace view, following pages automatically. */
  iterate(slug: string, params?: ListWorkspaceViewsParams): AsyncGenerator<View> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ViewField, "all"> & keyof View>(
    slug: string,
    view: string,
    params: { fields: readonly F[]; expand?: readonly ViewExpand[] }
  ): Promise<Pick<View, F | "id">>;
  retrieve(slug: string, view: string, params?: ViewShapeParams): Promise<View>;
  retrieve(slug: string, view: string, params?: ViewShapeParams): Promise<View> {
    return this.doRetrieve({ slug, pk: view }, params as Record<string, unknown>);
  }

  create(slug: string, data: CreateView, params?: ViewShapeParams): Promise<View> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update(slug: string, view: string, data: UpdateView, params?: ViewShapeParams): Promise<View> {
    return this.doUpdate(data, { slug, pk: view }, params as Record<string, unknown>);
  }

  delete(slug: string, view: string): Promise<void> {
    return this.doDelete({ slug, pk: view });
  }
}
