import { Page } from "../../../models/v2/common";
import {
  CopyDashboard,
  CreateDashboard,
  Dashboard,
  DashboardAccess,
  UpdateDashboard,
} from "../../../models/v2/Dashboard";
import { WidgetType } from "../../../models/v2/Widget";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { DASHBOARD_ID_NAMES, DashboardNavigation, LoadedDashboard, LoadedDashboardRow } from "../loaded/Dashboard";
import { Widgets } from "./Widgets";

export type DashboardField = (typeof FIELDS)["dashboards_list"][number];
export type DashboardOrderBy = (typeof ORDER_BY)["dashboards_list"][number];

export interface ListDashboardsParams {
  fields?: readonly DashboardField[];
  access?: DashboardAccess;
  owned_by_id?: string;
  is_shared?: boolean;
  /** Match on name. */
  search?: string;
  order_by?: DashboardOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface DashboardShapeParams {
  fields?: readonly DashboardField[];
}

/**
 * Workspace dashboards — CRUD, `copy`, the `widgetTypes` catalog, and the `widgets` child.
 *
 * Reached flat — `v2.workspaces.dashboards.list(slug)` — or from a fetched workspace:
 * `workspace.dashboards.list()`. Every row-returning method answers a
 * {@link LoadedDashboard}, so `(await dashboards.retrieve(slug, id)).widgets.list()` needs
 * no id repeated. A dashboard hidden from the caller (another member's private one, or any
 * dashboard when the caller isn't in the workspace) answers 404; a visible one the caller's role
 * or access level doesn't allow answers 403.
 */
export class Dashboards extends LoadsNavigableRows<Dashboard, CreateDashboard, UpdateDashboard, DashboardNavigation> {
  protected path = "/workspaces/{slug}/dashboards/";
  protected extraPaths = {
    // The API spells this route with a hyphen while the method is `widgetTypes`.
    widgetTypes: "/workspaces/{slug}/dashboards/widget-types/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "dashboards_list",
    retrieve: "dashboards_retrieve",
    create: "dashboards_create",
    update: "dashboards_partial_update",
    delete: "dashboards_destroy",
    copy: "dashboards_copy",
    widgetTypes: "dashboards_widget_types",
  };
  protected loadedIdNames = DASHBOARD_ID_NAMES;

  public widgets: Widgets;

  constructor(transport: V2Transport) {
    super(transport);
    this.widgets = new Widgets(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<DashboardNavigation> {
    const ids = meta.ids as [string, string];
    return {
      widgets: () => owned(this.widgets, ids, meta.idNames),
    };
  }

  /**
   * One page of `Dashboard` rows, newest first. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<DashboardField, "all"> & keyof Dashboard>(
    slug: string,
    params: ListDashboardsParams & { fields: readonly F[] }
  ): Promise<Page<LoadedDashboardRow<Pick<Dashboard, F | "id">>>>;
  /** One page of `Dashboard` rows, newest first. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListDashboardsParams): Promise<Page<LoadedDashboard>>;
  async list(slug: string, params?: ListDashboardsParams): Promise<Page<LoadedDashboard>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every dashboard the caller can see, following pages automatically. */
  iterate<F extends Exclude<DashboardField, "all"> & keyof Dashboard>(
    slug: string,
    params: Omit<ListDashboardsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedDashboardRow<Pick<Dashboard, F | "id">>>;
  /** Every dashboard the caller can see, following pages automatically. */
  iterate(slug: string, params?: Omit<ListDashboardsParams, "offset" | "count">): AsyncGenerator<LoadedDashboard>;
  iterate(slug: string, params?: Omit<ListDashboardsParams, "offset" | "count">): AsyncGenerator<LoadedDashboard> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<DashboardField, "all"> & keyof Dashboard>(
    slug: string,
    dashboard: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedDashboardRow<Pick<Dashboard, F | "id">>>;
  retrieve(slug: string, dashboard: string, params?: DashboardShapeParams): Promise<LoadedDashboard>;
  async retrieve(slug: string, dashboard: string, params?: DashboardShapeParams): Promise<LoadedDashboard> {
    const row = await this.doRetrieve({ slug, pk: dashboard }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** Create an empty dashboard owned by the caller. */
  create<F extends Exclude<DashboardField, "all"> & keyof Dashboard>(
    slug: string,
    data: CreateDashboard,
    params: DashboardShapeParams & { fields: readonly F[] }
  ): Promise<LoadedDashboardRow<Pick<Dashboard, F | "id">>>;
  /** Create an empty dashboard owned by the caller. */
  create(slug: string, data: CreateDashboard, params?: DashboardShapeParams): Promise<LoadedDashboard>;
  async create(slug: string, data: CreateDashboard, params?: DashboardShapeParams): Promise<LoadedDashboard> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  update<F extends Exclude<DashboardField, "all"> & keyof Dashboard>(
    slug: string,
    dashboard: string,
    data: UpdateDashboard,
    params: DashboardShapeParams & { fields: readonly F[] }
  ): Promise<LoadedDashboardRow<Pick<Dashboard, F | "id">>>;
  update(
    slug: string,
    dashboard: string,
    data: UpdateDashboard,
    params?: DashboardShapeParams
  ): Promise<LoadedDashboard>;
  async update(
    slug: string,
    dashboard: string,
    data: UpdateDashboard,
    params?: DashboardShapeParams
  ): Promise<LoadedDashboard> {
    const row = await this.doUpdate(data, { slug, pk: dashboard }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** Delete the dashboard; its public link stops serving straight away. */
  delete(slug: string, dashboard: string): Promise<void> {
    return this.doDelete({ slug, pk: dashboard });
  }

  /**
   * Copy a dashboard — settings, projects, filters and every widget — into a new one owned
   * by the caller. Shared members and the public link are not copied. Each field in `data`
   * overrides the copied value; `name` defaults to `"<source name> (Copy)"`. The source's own
   * values are copied as stored, so an older dashboard always copies.
   */
  copy<F extends Exclude<DashboardField, "all"> & keyof Dashboard>(
    slug: string,
    dashboard: string,
    data: CopyDashboard | undefined,
    params: DashboardShapeParams & { fields: readonly F[] }
  ): Promise<LoadedDashboardRow<Pick<Dashboard, F | "id">>>;
  /**
   * Copy a dashboard — settings, projects, filters and every widget — into a new one owned
   * by the caller. Shared members and the public link are not copied. Each field in `data`
   * overrides the copied value; `name` defaults to `"<source name> (Copy)"`.
   */
  copy(slug: string, dashboard: string, data?: CopyDashboard, params?: DashboardShapeParams): Promise<LoadedDashboard>;
  async copy(
    slug: string,
    dashboard: string,
    data?: CopyDashboard,
    params?: DashboardShapeParams
  ): Promise<LoadedDashboard> {
    const row = await this.doCustomAction<Dashboard>("copy", {
      method: "POST",
      pathParams: { slug },
      pk: dashboard,
      data: data ?? {},
      params: params as Record<string, unknown>,
    });
    return this.load(row, [slug], params?.fields);
  }

  /**
   * Every chart type a dashboard can hold, the chart models each accepts, and whether the
   * workspace's plan includes it. Not paginated; resolves to the response's `data` array.
   */
  async widgetTypes(slug: string): Promise<WidgetType[]> {
    const response = await this.doCustomAction<{ data: WidgetType[] }>("widgetTypes", {
      method: "GET",
      pathParams: { slug },
    });
    return response.data;
  }
}

export { Widgets } from "./Widgets";
export type { ListWidgetsParams, WidgetChartsParams, WidgetField, WidgetOrderBy, WidgetShapeParams } from "./Widgets";
