import type { Dashboard } from "../../../models/v2/Dashboard";
import type { Widgets } from "../Dashboards/Widgets";
import type { Loaded, Owned } from "../kernel/loaded";

/** The path ids a child of a dashboard row needs, in URL order. Dashboards are workspace-scoped. */
export type DashboardIds = [slug: string, dashboard: string];

/** The parameter names behind {@link DashboardIds}, in the same order. */
export const DASHBOARD_ID_NAMES = ["slug", "dashboard"] as const;

/** Everything a fetched dashboard can reach: its widgets and their chart data. */
export interface DashboardNavigation {
  /**
   * Widgets with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly widgets: Owned<Widgets, DashboardIds>;
}

/** A fetched dashboard row that is also the place its widgets live. */
export type LoadedDashboardRow<TRow> = Loaded<TRow, DashboardNavigation>;

export type LoadedDashboard = LoadedDashboardRow<Dashboard>;
