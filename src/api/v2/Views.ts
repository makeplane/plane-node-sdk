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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read or write; shared with {@link WorkspaceViews}. */
export interface ViewShapeParams {
  fields?: readonly ViewField[];
  expand?: readonly ViewExpand[];
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
    slug: string,
    project: string,
    params: ListProjectViewsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<View, F | "id">>>;
  list(slug: string, project: string, params?: ListProjectViewsParams): Promise<Page<View>>;
  list(slug: string, project: string, params?: ListProjectViewsParams): Promise<Page<View>> {
    return this.doList({ slug, project_id: project }, params as Record<string, unknown>);
  }

  /** Every project view, following pages automatically. */
  iterate<F extends Exclude<ViewField, "all"> & keyof View>(
    slug: string,
    project: string,
    params: Omit<ListProjectViewsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<View, F | "id">>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListProjectViewsParams, "offset" | "count">
  ): AsyncGenerator<View>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListProjectViewsParams, "offset" | "count">
  ): AsyncGenerator<View> {
    return this.doIterate({ slug, project_id: project }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ViewField, "all"> & keyof View>(
    slug: string,
    project: string,
    view: string,
    params: { fields: readonly F[]; expand?: readonly ViewExpand[] }
  ): Promise<Pick<View, F | "id">>;
  retrieve(slug: string, project: string, view: string, params?: ViewShapeParams): Promise<View>;
  retrieve(slug: string, project: string, view: string, params?: ViewShapeParams): Promise<View> {
    return this.doRetrieve({ slug, project_id: project, pk: view }, params as Record<string, unknown>);
  }

  /** The one view with this name; throws if none or several match. */
  findByName(slug: string, project: string, name: string): Promise<View> {
    return this.doFindOne({ name }, { slug, project_id: project });
  }

  create<F extends Exclude<ViewField, "all"> & keyof View>(
    slug: string,
    project: string,
    data: CreateView,
    params: ViewShapeParams & { fields: readonly F[] }
  ): Promise<Pick<View, F | "id">>;
  create(slug: string, project: string, data: CreateView, params?: ViewShapeParams): Promise<View>;
  create(slug: string, project: string, data: CreateView, params?: ViewShapeParams): Promise<View> {
    return this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
  }

  update<F extends Exclude<ViewField, "all"> & keyof View>(
    slug: string,
    project: string,
    view: string,
    data: UpdateView,
    params: ViewShapeParams & { fields: readonly F[] }
  ): Promise<Pick<View, F | "id">>;
  update(slug: string, project: string, view: string, data: UpdateView, params?: ViewShapeParams): Promise<View>;
  update(slug: string, project: string, view: string, data: UpdateView, params?: ViewShapeParams): Promise<View> {
    return this.doUpdate(data, { slug, project_id: project, pk: view }, params as Record<string, unknown>);
  }

  delete(slug: string, project: string, view: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: view });
  }
}
