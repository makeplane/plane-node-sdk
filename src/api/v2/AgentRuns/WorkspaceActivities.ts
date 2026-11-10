import { AgentRunActivity } from "../../../models/v2/AgentRunActivity";
import { Page } from "../../../models/v2/common";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { AgentRunActivityFilters } from "./Activities";

export type WorkspaceAgentRunActivityField = (typeof FIELDS)["workspace_run_activities_list"][number];
export type WorkspaceAgentRunActivityOrderBy = (typeof ORDER_BY)["workspace_run_activities_list"][number];
/** Only `"actor"`. */
export type WorkspaceAgentRunActivityExpand = (typeof EXPAND)["workspace_run_activities_list"][number];

export interface ListWorkspaceAgentRunActivitiesParams extends AgentRunActivityFilters {
  fields?: readonly WorkspaceAgentRunActivityField[];
  expand?: readonly WorkspaceAgentRunActivityExpand[];
  order_by?: WorkspaceAgentRunActivityOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/**
 * The cross-run activity feed (api_v2): every activity on every run the caller can list,
 * in one stream. Read-only.
 *
 * An agent keeps one `(created_at, id)` cursor here instead of polling run by run — for a
 * bot token the feed is every activity on its own runs. Narrow it with `agent_run_id`,
 * `type`/`type__in`, `signal` (a person's Stop arrives as a `prompt` with
 * `signal: "stop"`) or `created_at__gte`.
 *
 * Reached as `v2.workspaces.agentRunActivities.list(slug)`, or from a fetched workspace as
 * `workspace.agentRunActivities.list()`. It is a separate class from `AgentRunActivities`
 * because the route takes the slug alone: a fetched run binds that class, and this one
 * has no run id to bind.
 *
 * A sync read holds back rows stamped in the last 3 seconds until a later poll, so dedupe
 * by `id` when polling with `paginate: "cursor"` or `created_at__gte`.
 */
export class WorkspaceAgentRunActivities extends V2Resource<AgentRunActivity, never, never> {
  protected path = "/workspaces/{slug}/runs/activities/";
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_run_activities_list",
  };

  /**
   * One page of the feed, oldest first. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WorkspaceAgentRunActivityField, "all"> & keyof AgentRunActivity>(
    slug: string,
    params: ListWorkspaceAgentRunActivitiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AgentRunActivity, F | "id">>>;
  /** One page of the feed, oldest first. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListWorkspaceAgentRunActivitiesParams): Promise<Page<AgentRunActivity>>;
  list(slug: string, params?: ListWorkspaceAgentRunActivitiesParams): Promise<Page<AgentRunActivity>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** The whole feed, oldest first, following pages automatically. */
  iterate<F extends Exclude<WorkspaceAgentRunActivityField, "all"> & keyof AgentRunActivity>(
    slug: string,
    params: Omit<ListWorkspaceAgentRunActivitiesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<AgentRunActivity, F | "id">>;
  /** The whole feed, oldest first, following pages automatically. */
  iterate(
    slug: string,
    params?: Omit<ListWorkspaceAgentRunActivitiesParams, "offset" | "count">
  ): AsyncGenerator<AgentRunActivity>;
  iterate(
    slug: string,
    params?: Omit<ListWorkspaceAgentRunActivitiesParams, "offset" | "count">
  ): AsyncGenerator<AgentRunActivity> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }
}
