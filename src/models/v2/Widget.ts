import { ProblemDetail } from "../../errors/PlaneApiError";
import { DashboardPqlFilters } from "./Dashboard";

/** The chart types a widget can be created or updated with. */
export type WidgetChartType =
  | "BAR_CHART"
  | "LINE_CHART"
  | "AREA_CHART"
  | "PIE_CHART"
  | "DONUT_CHART"
  | "NUMBER"
  | "TABLE_CHART"
  | "WORK_ITEMS_TABLE"
  | "ASSIGNED_WORK_ITEMS_TABLE"
  | "WORK_ITEMS_STATISTICS"
  | "WORK_ITEM_TYPE_PROGRESS"
  | "WORK_ITEMS_SMART_COUNTER"
  | "WORK_ITEMS_SMART_GAUGE"
  | "CYCLE_PROGRESS_BAR"
  | "ACTIVE_CYCLE_PROGRESS_BAR"
  | "INTAKE_VOLUME_BY_SOURCE"
  | "INTAKE_ITEMS_AGEING"
  | "INTAKE_ACCEPT_VS_DECLINE_AVERAGE"
  | "INTAKE_ACCEPT_VS_DECLINE"
  | "INTAKE_BREAKDOWN";

/**
 * The chart types a stored widget can carry: every {@link WidgetChartType}, plus three the
 * web app created before the API existed. The API reads and filters on them but refuses
 * them on a write.
 */
export type StoredWidgetChartType =
  | WidgetChartType
  | "RICH_TEXT"
  | "WORK_ITEMS_CREATED_VS_RESOLVED"
  | "CYCLE_BURN_DOWN_CHART";

/** Allowed values depend on the chart type; a chart type without variants takes `BASIC`. */
export type WidgetChartModel = "BASIC" | "STACKED" | "GROUPED" | "MULTI_LINE" | "COMPARISON" | "PROGRESS";

/** Which widget filter applies: `pql_filters`, or `rich_filters` (which applies `filters`). */
export type WidgetLastUsedFilter = "pql_filters" | "rich_filters";

/** Bucket size for a date x axis. */
export type WidgetDateGrouping = "DAY" | "WEEK" | "MONTH" | "YEAR";

/** `y_axis_metric` on axis charts and `NUMBER`. */
export type WidgetYAxisMetric =
  | "WORK_ITEM_COUNT"
  | "ESTIMATE_POINT_COUNT"
  | "PENDING_WORK_ITEM_COUNT"
  | "COMPLETED_WORK_ITEM_COUNT"
  | "IN_PROGRESS_WORK_ITEM_COUNT"
  | "WORK_ITEM_DUE_THIS_WEEK_COUNT"
  | "WORK_ITEM_DUE_TODAY_COUNT"
  | "BLOCKED_WORK_ITEM_COUNT";

/**
 * One chart on a dashboard (api_v2). Every field except `id` is optional. For axis charts
 * the four axis fields are mirrored into `config`.
 */
export interface Widget {
  id: string;
  dashboard_id?: string;
  name?: string;
  chart_type?: StoredWidgetChartType;
  chart_model?: WidgetChartModel;
  /** Settings for the chart type; the keys each one reads are in the API's Charts reference. */
  config?: Record<string, unknown>;
  /** e.g. `PRIORITY`, `STATE_GROUPS`, `TARGET_DATE`, or a custom property as `cp_<property_id>`. */
  x_axis_property?: string | null;
  x_axis_date_grouping?: WidgetDateGrouping | null;
  y_axis_metric?: WidgetYAxisMetric | null;
  group_by?: string | null;
  width?: number;
  height?: number;
  x_axis_coord?: number;
  y_axis_coord?: number;
  pql_filters?: DashboardPqlFilters;
  /** The web app's filter-builder state. Stored and returned; charts don't read it. */
  rich_filters?: Record<string, unknown>;
  last_used_filter?: WidgetLastUsedFilter;
  filters?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  created_by_id?: string | null;
  updated_by_id?: string | null;
}

/** POST body. `name`, `chart_type` and `chart_model` are required by the API. */
export interface CreateWidget {
  name: string;
  chart_type: WidgetChartType;
  chart_model: WidgetChartModel;
  config?: Record<string, unknown>;
  x_axis_property?: string | null;
  x_axis_date_grouping?: WidgetDateGrouping | null;
  y_axis_metric?: WidgetYAxisMetric | null;
  group_by?: string | null;
  width?: number;
  height?: number;
  x_axis_coord?: number;
  y_axis_coord?: number;
  /** Applies when `last_used_filter` is `pql_filters`. */
  pql_filters?: DashboardPqlFilters;
  rich_filters?: Record<string, unknown>;
  last_used_filter?: WidgetLastUsedFilter;
  /** Applies when `last_used_filter` is `rich_filters`. */
  filters?: Record<string, unknown>;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateWidget = Partial<CreateWidget>;

/** One row of `Dashboards.widgetTypes`: a chart type, the models it accepts, and whether the plan includes it. */
export interface WidgetType {
  chart_type: WidgetChartType;
  /** Display name, e.g. `"Bar Chart"`. */
  name: string;
  /** The `chart_model` values it accepts; `["BASIC"]` for a chart type without variants. */
  chart_models: WidgetChartModel[];
  /** `false` when the plan doesn't include it: writing or charting a widget of this type answers 402. */
  available: boolean;
}

/** One entity in a chart's `schema` map — at least `id` and `name`, plus per-entity extras (`color`, `group`, …). */
export interface WidgetChartSchemaEntry {
  id: string;
  name: string;
  [key: string]: unknown;
}

/**
 * A widget's chart data. The shape depends on the widget's `chart_type` (see the API's
 * Charts reference), so only the fields most chart types share are named here; read the
 * rest by key.
 */
export interface WidgetChart {
  /** Entity key (`state`, `priority`, …) → id → display details for the ids in `data`. */
  schema?: Record<string, Record<string, WidgetChartSchemaEntry>>;
  /** The rows, buckets, slices or groups. `WORK_ITEMS_STATISTICS` puts them under `results.data` instead. */
  data?: unknown;
  /** Present on paginated chart types only. */
  total_count?: number;
  total_pages?: number;
  page?: number;
  per_page?: number;
  next_page?: number | null;
  prev_page?: number | null;
  [key: string]: unknown;
}

/** Query parameters of `Widgets.chart`. A chart type reads only the ones it uses and ignores the rest. */
export interface WidgetChartParams {
  /** Which page of rows (buckets, groups, counters), from 1. The page size is the chart's own config. */
  page?: number;
  /** `TABLE_CHART` only: which page of columns, from 1. */
  column_page?: number;
  /** `TABLE_CHART` only: the `data[].group_by_id` values already on screen. Sent JSON-encoded. */
  row_ids?: readonly string[];
}

/** One widget's entry in `Widgets.charts`. Each widget succeeds or fails on its own. */
export interface WidgetChartResult {
  widget_id: string;
  chart_type: StoredWidgetChartType;
  /** What the single `chart` call would answer: `200`, `400` or `402`. */
  status: number;
  /** With `status: 200`: the same body as `Widgets.chart`. */
  chart?: WidgetChart;
  /** Otherwise: the error body the single call would return. */
  error?: Partial<ProblemDetail>;
}
