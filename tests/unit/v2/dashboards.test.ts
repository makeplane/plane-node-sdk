import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { V2Namespace } from "../../../src/api/v2";
import { Dashboards } from "../../../src/api/v2/Dashboards";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const SLUG = "acme";
const DASHBOARD = "dash-1";
const WIDGET = "wid-1";

const config = () => new Configuration({ baseUrl: BASE, apiKey: "secret" });
const makeDashboards = () => new Dashboards(new V2Transport(config()));

afterEach(() => nock.cleanAll());

describe("Dashboards (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/dashboards/`;

  it("lists, creates, retrieves, updates and deletes a dashboard", async () => {
    nock(BASE)
      .get(collection)
      .query({ access: "1", is_shared: "false", search: "eng", order_by: "-updated_at" })
      .reply(200, { data: [{ id: DASHBOARD, name: "Engineering" }], pagination: { style: "offset" }, total_count: 1 });
    nock(BASE)
      .post(collection, { name: "Engineering", access: 1, project_ids: ["p1"] })
      .reply(201, { id: DASHBOARD, name: "Engineering", access: 1, project_ids: ["p1"] });
    nock(BASE).get(`${collection}${DASHBOARD}/`).reply(200, { id: DASHBOARD, name: "Engineering" });
    nock(BASE)
      .patch(`${collection}${DASHBOARD}/`, { pql_filters: { json: {}, stripped: 'priority = "high"' } })
      .reply(200, { id: DASHBOARD, pql_filters: { json: {}, stripped: 'priority = "high"' } });
    nock(BASE).delete(`${collection}${DASHBOARD}/`).reply(204);

    const dashboards = makeDashboards();
    const page = await dashboards.list(SLUG, { access: 1, is_shared: false, search: "eng", order_by: "-updated_at" });
    expect(page.data[0].name).toBe("Engineering");

    const created = await dashboards.create(SLUG, { name: "Engineering", access: 1, project_ids: ["p1"] });
    expect(created.project_ids).toEqual(["p1"]);

    expect((await dashboards.retrieve(SLUG, DASHBOARD)).name).toBe("Engineering");

    const updated = await dashboards.update(SLUG, DASHBOARD, {
      pql_filters: { json: {}, stripped: 'priority = "high"' },
    });
    expect(updated.pql_filters?.stripped).toBe('priority = "high"');

    await expect(dashboards.delete(SLUG, DASHBOARD)).resolves.toBeUndefined();
  });

  it("copies a dashboard with overrides, and with an empty body when none are given", async () => {
    const withBody = nock(BASE)
      .post(`${collection}${DASHBOARD}/copy/`, { name: "Engineering copy", access: 0 })
      .reply(201, { id: "dash-2", name: "Engineering copy", access: 0 });
    const withoutBody = nock(BASE)
      .post(`${collection}${DASHBOARD}/copy/`, {})
      .query({ fields: "name" })
      .reply(201, { id: "dash-3", name: "Engineering (Copy)" });
    nock(BASE)
      .get(`/api/v2/workspaces/${SLUG}/dashboards/dash-2/widgets/`)
      .reply(200, { data: [{ id: WIDGET }], pagination: { style: "offset" } });

    const dashboards = makeDashboards();
    const copy = await dashboards.copy(SLUG, DASHBOARD, { name: "Engineering copy", access: 0 });
    expect(copy.id).toBe("dash-2");
    // The copy is a loaded row like any other: it reaches its own widgets.
    expect((await copy.widgets.list()).data[0].id).toBe(WIDGET);

    const narrowed = await dashboards.copy(SLUG, DASHBOARD, undefined, { fields: ["name"] });
    expect(narrowed.name).toBe("Engineering (Copy)");

    expect(withBody.isDone()).toBe(true);
    expect(withoutBody.isDone()).toBe(true);
  });

  it("lists widget types as a plain array", async () => {
    nock(BASE)
      .get(`/api/v2/workspaces/${SLUG}/dashboards/widget-types/`)
      .reply(200, {
        data: [
          {
            chart_type: "BAR_CHART",
            name: "Bar Chart",
            chart_models: ["BASIC", "STACKED", "GROUPED"],
            available: true,
          },
          { chart_type: "WORK_ITEMS_TABLE", name: "Work Items Table", chart_models: ["BASIC"], available: false },
        ],
      });

    const types = await makeDashboards().widgetTypes(SLUG);

    expect(types.map((type) => type.chart_type)).toEqual(["BAR_CHART", "WORK_ITEMS_TABLE"]);
    expect(types[1].available).toBe(false);
  });

  it("answers navigable rows that reach their widgets, from a fetched workspace too", async () => {
    nock(BASE).get(`/api/v2/workspaces/${SLUG}/`).reply(200, { id: "ws-1", slug: SLUG });
    nock(BASE).get(`${collection}${DASHBOARD}/`).reply(200, { id: DASHBOARD, name: "Engineering" });
    nock(BASE)
      .get(`/api/v2/workspaces/${SLUG}/dashboards/${DASHBOARD}/widgets/`)
      .query({ chart_type: "NUMBER" })
      .reply(200, { data: [{ id: WIDGET, chart_type: "NUMBER" }], pagination: { style: "offset" } });

    const v2 = new V2Namespace(config());
    const workspace = await v2.workspaces.retrieve(SLUG);
    const dashboard = await workspace.dashboards.retrieve(DASHBOARD);

    expect(dashboard.$loaded.ids).toEqual([SLUG, DASHBOARD]);
    expect(dashboard.$loaded.idNames).toEqual(["slug", "dashboard"]);
    // Navigation is non-enumerable: the plain row is what serialises.
    expect(Object.keys(dashboard)).toEqual(["id", "name"]);

    const widgets = await dashboard.widgets.list({ chart_type: "NUMBER" });
    expect(widgets.data[0].chart_type).toBe("NUMBER");
  });

  it("iterates every dashboard across pages, still navigable", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "d1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get(collection)
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "d2" }], pagination: { style: "offset" }, next: null });

    const ids: string[] = [];
    for await (const dashboard of makeDashboards().iterate(SLUG)) {
      ids.push(dashboard.id);
      expect(typeof dashboard.widgets.list).toBe("function");
    }
    expect(ids).toEqual(["d1", "d2"]);
  });

  it("rejects an unknown field before making the request", async () => {
    await expect(makeDashboards().list(SLUG, { fields: ["nonexistent_field" as never] })).rejects.toThrow(
      /Unknown field\(s\) for dashboards_list: nonexistent_field/
    );
  });
});

describe("Dashboard widgets (v2)", () => {
  const widgetsUrl = `/api/v2/workspaces/${SLUG}/dashboards/${DASHBOARD}/widgets/`;

  it("creates, retrieves, updates and deletes a widget", async () => {
    const body = {
      name: "Open work items",
      chart_type: "NUMBER" as const,
      chart_model: "BASIC" as const,
      y_axis_metric: "WORK_ITEM_COUNT" as const,
      width: 3,
      height: 2,
    };
    nock(BASE)
      .post(widgetsUrl, body)
      .reply(201, { id: WIDGET, dashboard_id: DASHBOARD, ...body, config: { y_axis_metric: "WORK_ITEM_COUNT" } });
    nock(BASE)
      .get(`${widgetsUrl}${WIDGET}/`)
      .query({ fields: "name" })
      .reply(200, { id: WIDGET, name: "Open work items" });
    nock(BASE).patch(`${widgetsUrl}${WIDGET}/`, { x_axis_coord: 6 }).reply(200, { id: WIDGET, x_axis_coord: 6 });
    nock(BASE).delete(`${widgetsUrl}${WIDGET}/`).reply(204);

    const widgets = makeDashboards().widgets;
    const created = await widgets.create(SLUG, DASHBOARD, body);
    expect(created.dashboard_id).toBe(DASHBOARD);
    expect(created.config).toEqual({ y_axis_metric: "WORK_ITEM_COUNT" });

    const fetched = await widgets.retrieve(SLUG, DASHBOARD, WIDGET, { fields: ["name"] });
    expect(fetched.name).toBe("Open work items");

    expect((await widgets.update(SLUG, DASHBOARD, WIDGET, { x_axis_coord: 6 })).x_axis_coord).toBe(6);
    await expect(widgets.delete(SLUG, DASHBOARD, WIDGET)).resolves.toBeUndefined();
  });

  it("creates a PQL-filtered widget that charts with its PQL", async () => {
    const body = {
      name: "Urgent by state",
      chart_type: "BAR_CHART" as const,
      chart_model: "BASIC" as const,
      x_axis_property: "STATE_GROUPS",
      y_axis_metric: "WORK_ITEM_COUNT" as const,
      pql_filters: { json: {}, stripped: 'priority = "urgent"' },
      last_used_filter: "pql_filters" as const,
    };
    const scope = nock(BASE)
      .post(widgetsUrl, body)
      .reply(201, { id: WIDGET, ...body, pql_filters: { ...body.pql_filters, json: {} }, filters: {} });

    const created = await makeDashboards().widgets.create(SLUG, DASHBOARD, body);

    expect(scope.isDone()).toBe(true);
    expect(created.last_used_filter).toBe("pql_filters");
    expect(created.pql_filters?.stripped).toBe('priority = "urgent"');
  });

  it("sends null to clear the axis fields on an update", async () => {
    const cleared = { group_by: null, x_axis_property: null, x_axis_date_grouping: null, y_axis_metric: null };
    const scope = nock(BASE)
      .patch(`${widgetsUrl}${WIDGET}/`, (sent) => JSON.stringify(sent) === JSON.stringify(cleared))
      .reply(200, { id: WIDGET, ...cleared, last_used_filter: "" });

    const updated = await makeDashboards().widgets.update(SLUG, DASHBOARD, WIDGET, cleared);

    expect(scope.isDone()).toBe(true);
    expect(updated.group_by).toBeNull();
    // The read model types these as free text: a widget the web app saved can carry "".
    expect(updated.last_used_filter).toBe("");
  });

  it("lists widgets with the chart filters and sort order", async () => {
    nock(BASE)
      .get(widgetsUrl)
      .query({ chart_type: "BAR_CHART", chart_model: "STACKED", search: "prio", order_by: "-created_at" })
      .reply(200, { data: [{ id: WIDGET, name: "By priority" }], pagination: { style: "offset" } });

    const page = await makeDashboards().widgets.list(SLUG, DASHBOARD, {
      chart_type: "BAR_CHART",
      chart_model: "STACKED",
      search: "prio",
      order_by: "-created_at",
    });

    expect(page.data[0].name).toBe("By priority");
  });

  it("fetches one widget's chart, JSON-encoding row_ids", async () => {
    const scope = nock(BASE)
      .get(`${widgetsUrl}${WIDGET}/chart/`)
      .query({ page: "2", column_page: "2", row_ids: '["backlog","started"]' })
      .reply(200, {
        schema: { state_group: { backlog: { id: "backlog", name: "Backlog" } } },
        page: 2,
        total_pages: 2,
        data: [{ group_by_id: "backlog", cells: { high: 1 } }],
        columns: ["high"],
      });

    const chart = await makeDashboards().widgets.chart(SLUG, DASHBOARD, WIDGET, {
      page: 2,
      column_page: 2,
      row_ids: ["backlog", "started"],
    });

    expect(scope.isDone()).toBe(true);
    expect(chart.page).toBe(2);
    expect(chart.schema?.state_group.backlog.name).toBe("Backlog");
    expect(chart.columns).toEqual(["high"]);
  });

  it("pages a table chart by rows and columns without sending row_ids", async () => {
    const scope = nock(BASE)
      .get(`${widgetsUrl}${WIDGET}/chart/`)
      .query((query) => JSON.stringify(query) === JSON.stringify({ page: "3", column_page: "2" }))
      .reply(200, {
        schema: {},
        data: [{ group_by_id: "urgent", cells: { backlog: 4 } }],
        columns: ["backlog"],
        page: 3,
        per_page: 10,
        total_pages: 3,
        next_page: null,
        prev_page: 2,
      });

    const chart = await makeDashboards().widgets.chart(SLUG, DASHBOARD, WIDGET, { page: 3, column_page: 2 });

    expect(scope.isDone()).toBe(true);
    expect(chart.page).toBe(3);
    expect(chart.next_page).toBeNull();
    expect(chart.prev_page).toBe(2);
  });

  it("fetches a chart with no query string when no params are given", async () => {
    nock(BASE)
      .get(`${widgetsUrl}${WIDGET}/chart/`)
      .query((query) => Object.keys(query).length === 0)
      .reply(200, { schema: {}, value: 10, y_axis_metric: "WORK_ITEM_COUNT" });

    const chart = await makeDashboards().widgets.chart(SLUG, DASHBOARD, WIDGET);

    expect(chart.value).toBe(10);
  });

  it("fetches every widget's chart in one call, comma-joining widget_ids", async () => {
    nock(BASE)
      .get(`${widgetsUrl}charts/`)
      .query({ widget_ids: "w1,w2" })
      .reply(200, {
        data: [
          { widget_id: "w1", chart_type: "NUMBER", status: 200, chart: { schema: {}, value: 10 } },
          {
            widget_id: "w2",
            chart_type: "WORK_ITEMS_TABLE",
            status: 400,
            error: {
              type: "invalid_request",
              code: "invalid_request",
              detail: "One or more fields failed validation.",
            },
          },
        ],
      });

    const results = await makeDashboards().widgets.charts(SLUG, DASHBOARD, { widget_ids: ["w1", "w2"] });

    expect(results).toHaveLength(2);
    expect(results[0].chart?.value).toBe(10);
    expect(results[1].status).toBe(400);
    expect(results[1].error?.code).toBe("invalid_request");
  });

  it("sends the null row of a table chart in row_ids, and an empty list as []", async () => {
    const withNull = nock(BASE)
      .get(`${widgetsUrl}${WIDGET}/chart/`)
      .query({ column_page: "2", row_ids: '["u1",null]' })
      .reply(200, { schema: {}, data: [], columns: [] });
    const empty = nock(BASE)
      .get(`${widgetsUrl}${WIDGET}/chart/`)
      .query({ row_ids: "[]" })
      .reply(200, { schema: {}, data: [], columns: [] });

    const widgets = makeDashboards().widgets;
    await widgets.chart(SLUG, DASHBOARD, WIDGET, { column_page: 2, row_ids: ["u1", null] });
    await widgets.chart(SLUG, DASHBOARD, WIDGET, { row_ids: [] });

    expect(withNull.isDone()).toBe(true);
    expect(empty.isDone()).toBe(true);
  });

  it("rejects with PlaneApiError when a chart can't be served", async () => {
    nock(BASE).get(`${widgetsUrl}${WIDGET}/chart/`).reply(
      402,
      { type: "payment_required", code: "payment_required", detail: "Upgrade." },
      {
        "Content-Type": "application/problem+json",
      }
    );

    const error = await makeDashboards()
      .widgets.chart(SLUG, DASHBOARD, WIDGET)
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PlaneApiError);
    expect((error as PlaneApiError).status).toBe(402);
  });

  it("fetches every widget's chart with no query string when no widget_ids are given", async () => {
    const scope = nock(BASE)
      .get(`${widgetsUrl}charts/`)
      .query((query) => Object.keys(query).length === 0)
      .reply(200, { data: [] });

    await expect(makeDashboards().widgets.charts(SLUG, DASHBOARD)).resolves.toEqual([]);
    expect(scope.isDone()).toBe(true);
  });

  it("iterates every widget across pages", async () => {
    nock(BASE)
      .get(widgetsUrl)
      .reply(200, { data: [{ id: "w1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get(widgetsUrl)
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "w2" }], pagination: { style: "offset" }, next: null });

    const ids: string[] = [];
    for await (const widget of makeDashboards().widgets.iterate(SLUG, DASHBOARD)) ids.push(widget.id);
    expect(ids).toEqual(["w1", "w2"]);
  });

  it("answers an empty widget_ids selection with no request", async () => {
    // `?widget_ids=` used to chart every widget, so the call must not reach the server at all.
    const scope = nock(BASE)
      .get(`${widgetsUrl}charts/`)
      .query(true)
      .reply(200, { data: [{ widget_id: "w1", chart_type: "NUMBER", status: 200, chart: { value: 1 } }] });

    await expect(makeDashboards().widgets.charts(SLUG, DASHBOARD, { widget_ids: [] })).resolves.toEqual([]);

    expect(scope.isDone()).toBe(false);
  });
});
