import { Page } from "../../../models/v2/common";
import { AutomationActivity } from "../../../models/v2/AutomationActivity";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type ProjectAutomationActivityField = (typeof FIELDS)["project_automation_activities_list"][number];
export type ProjectAutomationActivityOrderBy = (typeof ORDER_BY)["project_automation_activities_list"][number];

export interface ListProjectAutomationActivitiesParams {
  fields?: readonly ProjectAutomationActivityField[];
  field?: string;
  verb?: string;
  created_at__gt?: string;
  order_by?: ProjectAutomationActivityOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/**
 * Audit log for a project-scoped automation.
 *
 * Reached flat — `v2.workspaces.projects.automations.activities.list(slug, project, automation)` — or from a fetched automation: `automation.activities.list()`. Read-only.
 */
export class ProjectAutomationActivities extends V2Resource<AutomationActivity, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/automations/{automation_id}/activities/";
  protected operations: Record<string, OperationId> = {
    list: "project_automation_activities_list",
    retrieve: "project_automation_activities_retrieve",
  };

  private _at(slug: string, project: string, automation: string, activity?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project, automation_id: automation };
    if (activity !== undefined) params.pk = activity;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectAutomationActivityField, "all"> & keyof AutomationActivity>(
    slug: string,
    project: string,
    automation: string,
    params: ListProjectAutomationActivitiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationActivity, F | "id">>>;
  list(
    slug: string,
    project: string,
    automation: string,
    params?: ListProjectAutomationActivitiesParams
  ): Promise<Page<AutomationActivity>>;
  list(
    slug: string,
    project: string,
    automation: string,
    params?: ListProjectAutomationActivitiesParams
  ): Promise<Page<AutomationActivity>> {
    return this.doList(this._at(slug, project, automation), params as Record<string, unknown>);
  }

  /** Every activity, following pages automatically. */
  iterate<F extends Exclude<ProjectAutomationActivityField, "all"> & keyof AutomationActivity>(
    slug: string,
    project: string,
    automation: string,
    params: Omit<ListProjectAutomationActivitiesParams, "offset" | "count"> & {
      fields: readonly F[];
    }
  ): AsyncGenerator<Pick<AutomationActivity, F | "id">>;
  iterate(
    slug: string,
    project: string,
    automation: string,
    params?: Omit<ListProjectAutomationActivitiesParams, "offset" | "count">
  ): AsyncGenerator<AutomationActivity>;
  iterate(
    slug: string,
    project: string,
    automation: string,
    params?: Omit<ListProjectAutomationActivitiesParams, "offset" | "count">
  ): AsyncGenerator<AutomationActivity> {
    return this.doIterate(this._at(slug, project, automation), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ProjectAutomationActivityField, "all"> & keyof AutomationActivity>(
    slug: string,
    project: string,
    automation: string,
    activity: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationActivity, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    automation: string,
    activity: string,
    params?: { fields?: readonly ProjectAutomationActivityField[] }
  ): Promise<AutomationActivity>;
  retrieve(
    slug: string,
    project: string,
    automation: string,
    activity: string,
    params?: { fields?: readonly ProjectAutomationActivityField[] }
  ): Promise<AutomationActivity> {
    return this.doRetrieve(this._at(slug, project, automation, activity), params as Record<string, unknown>);
  }
}
