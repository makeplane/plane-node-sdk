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
  count?: boolean;
}

/** Audit log for a workspace-scoped (global) automation, at `...automations.activities`. Read-only. */
export class WorkspaceAutomationActivities extends V2Resource<AutomationActivity, never, never> {
  protected path = "/workspaces/{slug}/automations/{automation_id}/activities/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_automation_activities_list",
    retrieve: "workspace_automation_activities_retrieve",
  };

  private pk(automationId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { automation_id: automationId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceAutomationActivityField, "all"> & keyof AutomationActivity>(
    automationId: string,
    params: ListWorkspaceAutomationActivitiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationActivity, F | "id">>>;
  list(automationId: string, params?: ListWorkspaceAutomationActivitiesParams): Promise<Page<AutomationActivity>>;
  list(automationId: string, params?: ListWorkspaceAutomationActivitiesParams): Promise<Page<AutomationActivity>> {
    return this.doList(this.pk(automationId), params as Record<string, unknown>);
  }

  /** Every activity, following pages automatically. */
  iterate(automationId: string, params?: ListWorkspaceAutomationActivitiesParams): AsyncGenerator<AutomationActivity> {
    return this.doIterate(this.pk(automationId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAutomationActivityField, "all"> & keyof AutomationActivity>(
    automationId: string,
    activityId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationActivity, F | "id">>;
  retrieve(
    automationId: string,
    activityId: string,
    params?: { fields?: readonly WorkspaceAutomationActivityField[] }
  ): Promise<AutomationActivity>;
  retrieve(
    automationId: string,
    activityId: string,
    params?: { fields?: readonly WorkspaceAutomationActivityField[] }
  ): Promise<AutomationActivity> {
    return this.doRetrieve(this.pk(automationId, activityId), params as Record<string, unknown>);
  }
}
