import { Page } from "../../../models/v2/common";
import { AutomationActivity } from "../../../models/v2/AutomationActivity";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkspaceAutomationActivityField = (typeof FIELDS)["workspace_automation_activities_list"][number];
export type WorkspaceAutomationActivityOrderBy = (typeof ORDER_BY)["workspace_automation_activities_list"][number];

export interface ListWorkspaceAutomationActivitiesParams {
  fields?: readonly WorkspaceAutomationActivityField[];
  field?: string;
  verb?: string;
  created_at__gt?: string;
  order_by?: WorkspaceAutomationActivityOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/**
 * Audit log for a workspace-scoped (global) automation.
 *
 * Reached flat — `v2.workspaces.automations.activities.list(slug, automation)` — or from a fetched automation: `automation.activities.list()`. Read-only.
 */
export class WorkspaceAutomationActivities extends V2Resource<AutomationActivity, never, never> {
  protected path = "/workspaces/{slug}/automations/{automation_id}/activities/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_automation_activities_list",
    retrieve: "workspace_automation_activities_retrieve",
  };

  private _at(slug: string, automation: string, activity?: string): Record<string, string> {
    const params: Record<string, string> = { slug, automation_id: automation };
    if (activity !== undefined) params.pk = activity;
    return params;
  }

  /**
   * One page of `AutomationActivity` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WorkspaceAutomationActivityField, "all"> & keyof AutomationActivity>(
    slug: string,
    automation: string,
    params: ListWorkspaceAutomationActivitiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationActivity, F | "id">>>;
  /** One page of `AutomationActivity` rows. Use `iterate` to follow pages automatically. */
  list(
    slug: string,
    automation: string,
    params?: ListWorkspaceAutomationActivitiesParams
  ): Promise<Page<AutomationActivity>>;
  list(
    slug: string,
    automation: string,
    params?: ListWorkspaceAutomationActivitiesParams
  ): Promise<Page<AutomationActivity>> {
    return this.doList(this._at(slug, automation), params as Record<string, unknown>);
  }

  /** Every activity, following pages automatically. */
  iterate<F extends Exclude<WorkspaceAutomationActivityField, "all"> & keyof AutomationActivity>(
    slug: string,
    automation: string,
    params: Omit<ListWorkspaceAutomationActivitiesParams, "offset" | "count"> & {
      fields: readonly F[];
    }
  ): AsyncGenerator<Pick<AutomationActivity, F | "id">>;
  /** Every activity, following pages automatically. */
  iterate(
    slug: string,
    automation: string,
    params?: Omit<ListWorkspaceAutomationActivitiesParams, "offset" | "count">
  ): AsyncGenerator<AutomationActivity>;
  iterate(
    slug: string,
    automation: string,
    params?: Omit<ListWorkspaceAutomationActivitiesParams, "offset" | "count">
  ): AsyncGenerator<AutomationActivity> {
    return this.doIterate(this._at(slug, automation), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAutomationActivityField, "all"> & keyof AutomationActivity>(
    slug: string,
    automation: string,
    activity: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationActivity, F | "id">>;
  retrieve(
    slug: string,
    automation: string,
    activity: string,
    params?: { fields?: readonly WorkspaceAutomationActivityField[] }
  ): Promise<AutomationActivity>;
  retrieve(
    slug: string,
    automation: string,
    activity: string,
    params?: { fields?: readonly WorkspaceAutomationActivityField[] }
  ): Promise<AutomationActivity> {
    return this.doRetrieve(this._at(slug, automation, activity), params as Record<string, unknown>);
  }
}
