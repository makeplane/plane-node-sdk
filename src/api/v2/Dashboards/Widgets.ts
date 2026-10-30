import { Page } from "../../../models/v2/common";
import {
  CreateWidget,
  StoredWidgetChartType,
  UpdateWidget,
  Widget,
  WidgetChart,
  WidgetChartModel,
  WidgetChartParams,
  WidgetChartResult,
} from "../../../models/v2/Widget";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type WidgetField = (typeof FIELDS)["widgets_list"][number];
export type WidgetOrderBy = (typeof ORDER_BY)["widgets_list"][number];

export interface ListWidgetsParams {
  fields?: readonly WidgetField[];
  chart_type?: StoredWidgetChartType;
  chart_model?: WidgetChartModel;
  /** Match on name. */
  search?: string;
  order_by?: WidgetOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WidgetShapeParams {
  fields?: readonly WidgetField[];
}

/** Query parameters of {@link Widgets.charts}. */
export interface WidgetChartsParams {
  /** Only these widgets (sent comma-separated). Ids not on the dashboard are skipped. Default: every widget. */
  widget_ids?: readonly string[];
}

/**
 * The widgets on a dashboard — CRUD plus their chart data.
 *
 * Reached flat — `v2.workspaces.dashboards.widgets.list(slug, dashboard)` — or from a
 * fetched dashboard: `dashboard.widgets.list()`. A widget row holds its settings only; the
 * data it draws comes from {@link chart} (one widget, pageable) or {@link charts} (every
 * widget at its first page, in layout order).
 */
export class Widgets extends V2Resource<Widget, CreateWidget, UpdateWidget> {
  protected path = "/workspaces/{slug}/dashboards/{dashboard_id}/widgets/";
  protected extraPaths = {
    chart: "/workspaces/{slug}/dashboards/{dashboard_id}/widgets/{widget_id}/chart/",
    charts: "/workspaces/{slug}/dashboards/{dashboard_id}/widgets/charts/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "widgets_list",
    retrieve: "widgets_retrieve",
    create: "widgets_create",
    update: "widgets_partial_update",
    delete: "widgets_destroy",
    chart: "widgets_chart",
    charts: "widgets_charts",
  };

  private _at(slug: string, dashboard: string, widget?: string): Record<string, string> {
    const params: Record<string, string> = { slug, dashboard_id: dashboard };
    if (widget !== undefined) params.pk = widget;
    return params;
  }

  /**
   * One page of `Widget` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WidgetField, "all"> & keyof Widget>(
    slug: string,
    dashboard: string,
    params: ListWidgetsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Widget, F | "id">>>;
  /** One page of `Widget` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, dashboard: string, params?: ListWidgetsParams): Promise<Page<Widget>>;
  list(slug: string, dashboard: string, params?: ListWidgetsParams): Promise<Page<Widget>> {
    return this.doList(this._at(slug, dashboard), params as Record<string, unknown>);
  }

  /** Every widget on the dashboard, following pages automatically. */
  iterate<F extends Exclude<WidgetField, "all"> & keyof Widget>(
    slug: string,
    dashboard: string,
    params: Omit<ListWidgetsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<Widget, F | "id">>;
  /** Every widget on the dashboard, following pages automatically. */
  iterate(
    slug: string,
    dashboard: string,
    params?: Omit<ListWidgetsParams, "offset" | "count">
  ): AsyncGenerator<Widget>;
  iterate(
    slug: string,
    dashboard: string,
    params?: Omit<ListWidgetsParams, "offset" | "count">
  ): AsyncGenerator<Widget> {
    return this.doIterate(this._at(slug, dashboard), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WidgetField, "all"> & keyof Widget>(
    slug: string,
    dashboard: string,
    widget: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Widget, F | "id">>;
  retrieve(slug: string, dashboard: string, widget: string, params?: WidgetShapeParams): Promise<Widget>;
  retrieve(slug: string, dashboard: string, widget: string, params?: WidgetShapeParams): Promise<Widget> {
    return this.doRetrieve(this._at(slug, dashboard, widget), params as Record<string, unknown>);
  }

  /** Add a widget. The API checks it against its chart type first and refuses (400) one it could not draw. */
  create<F extends Exclude<WidgetField, "all"> & keyof Widget>(
    slug: string,
    dashboard: string,
    data: CreateWidget,
    params: WidgetShapeParams & { fields: readonly F[] }
  ): Promise<Pick<Widget, F | "id">>;
  /** Add a widget. The API checks it against its chart type first and refuses (400) one it could not draw. */
  create(slug: string, dashboard: string, data: CreateWidget, params?: WidgetShapeParams): Promise<Widget>;
  create(slug: string, dashboard: string, data: CreateWidget, params?: WidgetShapeParams): Promise<Widget> {
    return this.doCreate(data, this._at(slug, dashboard), params as Record<string, unknown>);
  }

  update<F extends Exclude<WidgetField, "all"> & keyof Widget>(
    slug: string,
    dashboard: string,
    widget: string,
    data: UpdateWidget,
    params: WidgetShapeParams & { fields: readonly F[] }
  ): Promise<Pick<Widget, F | "id">>;
  update(
    slug: string,
    dashboard: string,
    widget: string,
    data: UpdateWidget,
    params?: WidgetShapeParams
  ): Promise<Widget>;
  update(
    slug: string,
    dashboard: string,
    widget: string,
    data: UpdateWidget,
    params?: WidgetShapeParams
  ): Promise<Widget> {
    return this.doUpdate(data, this._at(slug, dashboard, widget), params as Record<string, unknown>);
  }

  delete(slug: string, dashboard: string, widget: string): Promise<void> {
    return this.doDelete(this._at(slug, dashboard, widget));
  }

  /**
   * The data one widget draws, computed from the dashboard's current work items with both
   * the dashboard's and the widget's filters applied. The shape depends on the widget's
   * `chart_type`. `row_ids` is sent as the JSON array the API expects.
   */
  chart(slug: string, dashboard: string, widget: string, params?: WidgetChartParams): Promise<WidgetChart> {
    const { row_ids, ...rest } = params ?? {};
    return this.doCustomAction<WidgetChart>("chart", {
      method: "GET",
      pathParams: { slug, dashboard_id: dashboard, widget_id: widget },
      params: { ...rest, row_ids: row_ids === undefined ? undefined : JSON.stringify(row_ids) },
    });
  }

  /**
   * Every widget's chart data in one call, in layout order, each at its first page.
   * Resolves to the response's `data` array: one entry per widget, each carrying its own
   * `status` and either `chart` or `error`, so one widget failing never fails the call.
   */
  async charts(slug: string, dashboard: string, params?: WidgetChartsParams): Promise<WidgetChartResult[]> {
    const response = await this.doCustomAction<{ data: WidgetChartResult[] }>("charts", {
      method: "GET",
      pathParams: { slug, dashboard_id: dashboard },
      params: params as Record<string, unknown>,
    });
    return response.data;
  }
}
