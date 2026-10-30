/**
 * Dashboards and their widgets against a real server — CRUD, copy, widgetTypes, and the
 * chart/charts reads. EE-gated on FeatureFlag.DASHBOARDS, so a 402 sits the file out.
 * Widgets are reached off the fetched dashboard row, so the dashboard id is never repeated.
 */
import { LoadedDashboard } from "../../../src/api/v2/loaded/Dashboard";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { useCapability } from "./support/capability";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 dashboards (live)", () => {
  const suite = useV2Project("dashboards", env);
  const dashboards = () => suite.client.v2.workspaces.dashboards;
  const slug = () => suite.workspaceSlug;
  const capability = useCapability("FeatureFlag.DASHBOARDS is not enabled for this workspace");

  async function withDashboard(body: (dashboard: LoadedDashboard) => Promise<void>): Promise<void> {
    const dashboard = await dashboards().create(slug(), {
      name: uniqueName("dashboard"),
      project_ids: [suite.projectId],
    });
    try {
      await body(dashboard);
    } finally {
      await dashboards()
        .delete(slug(), dashboard.id)
        .catch(() => undefined);
    }
  }

  capability.it("creates, retrieves, updates, lists, then deletes a dashboard", async () => {
    await withDashboard(async (dashboard) => {
      expect(dashboard.project_ids).toEqual([suite.projectId]);

      const fetched = await dashboards().retrieve(slug(), dashboard.id);
      expect(fetched.name).toBe(dashboard.name);

      const renamed = uniqueName("dashboard");
      const updated = await dashboards().update(slug(), dashboard.id, { name: renamed });
      expect(updated.name).toBe(renamed);

      const page = await dashboards().list(slug(), { search: renamed });
      expect(page.data.map((row) => row.id)).toContain(dashboard.id);

      await expect(dashboards().delete(slug(), dashboard.id)).resolves.toBeUndefined();
      const status = await dashboards()
        .retrieve(slug(), dashboard.id)
        .then(
          () => 200,
          (error: unknown) => (error instanceof PlaneApiError ? error.status : -1)
        );
      expect(status).toBe(404);
    });
  });

  capability.it("lists widget types with their chart models", async () => {
    const types = await dashboards().widgetTypes(slug());
    const bar = types.find((row) => row.chart_type === "BAR_CHART");
    expect(bar?.chart_models).toContain("BASIC");
  });

  capability.it("creates, updates, charts, then deletes a widget", async () => {
    await withDashboard(async (dashboard) => {
      const widget = await dashboard.widgets.create({
        name: "By priority",
        chart_type: "BAR_CHART",
        chart_model: "STACKED",
        x_axis_property: "PRIORITY",
        y_axis_metric: "WORK_ITEM_COUNT",
        group_by: "STATE_GROUPS",
      });
      expect(widget.dashboard_id).toBe(dashboard.id);

      const moved = await dashboard.widgets.update(widget.id, { x_axis_coord: 6 });
      expect(moved.x_axis_coord).toBe(6);

      const chart = await dashboard.widgets.chart(widget.id);
      expect(Array.isArray(chart.data)).toBe(true);
      expect(chart.page).toBe(1);

      const results = await dashboard.widgets.charts({ widget_ids: [widget.id] });
      expect(results.map((row) => [row.widget_id, row.status])).toEqual([[widget.id, 200]]);

      await dashboard.widgets.delete(widget.id);
      const page = await dashboard.widgets.list();
      expect(page.data.map((row) => row.id)).not.toContain(widget.id);
    });
  });

  capability.it("refuses a widget missing its required axis", async () => {
    await withDashboard(async (dashboard) => {
      const status = await dashboard.widgets
        .create({ name: "No axis", chart_type: "BAR_CHART", chart_model: "BASIC" })
        .then(
          () => 201,
          (error: unknown) => (error instanceof PlaneApiError ? error.status : -1)
        );
      expect(status).toBe(400);
    });
  });

  capability.it("copies a dashboard with its widgets", async () => {
    await withDashboard(async (dashboard) => {
      await dashboard.widgets.create({
        name: "Total",
        chart_type: "NUMBER",
        chart_model: "BASIC",
        y_axis_metric: "WORK_ITEM_COUNT",
      });
      const copyName = uniqueName("dashboard-copy");
      const copied = await dashboards().copy(slug(), dashboard.id, { name: copyName });
      try {
        expect(copied.name).toBe(copyName);
        const widgets = await copied.widgets.list();
        expect(widgets.data.map((row) => row.name)).toEqual(["Total"]);
      } finally {
        await dashboards()
          .delete(slug(), copied.id)
          .catch(() => undefined);
      }
    });
  });
});
