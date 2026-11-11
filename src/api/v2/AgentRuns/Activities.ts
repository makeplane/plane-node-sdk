import {
  AgentRunActivity,
  AgentRunActivitySignal,
  AgentRunActivityType,
  CreateAgentRunActivity,
} from "../../../models/v2/AgentRunActivity";
import { Page } from "../../../models/v2/common";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type AgentRunActivityField = (typeof FIELDS)["run_activities_list"][number];
export type AgentRunActivityOrderBy = (typeof ORDER_BY)["run_activities_list"][number];
/** Only `"actor"`. */
export type AgentRunActivityExpand = (typeof EXPAND)["run_activities_list"][number];

/**
 * The filters both activity lists accept — one run's log here, and the cross-run feed
 * (`WorkspaceAgentRunActivities`), which declares the identical set.
 */
export interface AgentRunActivityFilters {
  actor_id?: string;
  /** Narrows the cross-run feed to one run; redundant on a single run's log. */
  agent_run_id?: string;
  comment_id?: string;
  /** Activities created at or after this ISO 8601 timestamp — the polling watermark. */
  created_at__gte?: string;
  ephemeral?: boolean;
  signal?: AgentRunActivitySignal;
  type?: AgentRunActivityType;
  type__in?: readonly AgentRunActivityType[];
}

export interface ListAgentRunActivitiesParams extends AgentRunActivityFilters {
  fields?: readonly AgentRunActivityField[];
  expand?: readonly AgentRunActivityExpand[];
  order_by?: AgentRunActivityOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface AgentRunActivityShapeParams {
  fields?: readonly AgentRunActivityField[];
  expand?: readonly AgentRunActivityExpand[];
}

/**
 * One agent run's activity log (api_v2): list, read, and post. No PATCH and no DELETE —
 * an activity is a record of what happened.
 *
 * Reached flat — `v2.workspaces.agentRuns.activities.list(slug, run)` — or from a fetched run,
 * which supplies both ids: `run.activities.list()`.
 *
 * Oldest first, by `(created_at, id)`, which is cursor-safe: an agent that polls with
 * `paginate: "cursor"` or `created_at__gte` should dedupe by `id`, because a sync read
 * holds back rows stamped in the last 3 seconds until a later poll.
 */
export class AgentRunActivities extends V2Resource<AgentRunActivity, CreateAgentRunActivity, never> {
  protected path = "/workspaces/{slug}/runs/{run_id}/activities/";
  protected operations: Record<string, AnyOperationId> = {
    list: "run_activities_list",
    retrieve: "run_activities_retrieve",
    create: "run_activities_create",
  };

  /**
   * One page of `AgentRunActivity` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<AgentRunActivityField, "all"> & keyof AgentRunActivity>(
    slug: string,
    run: string,
    params: ListAgentRunActivitiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AgentRunActivity, F | "id">>>;
  /** One page of `AgentRunActivity` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, run: string, params?: ListAgentRunActivitiesParams): Promise<Page<AgentRunActivity>>;
  list(slug: string, run: string, params?: ListAgentRunActivitiesParams): Promise<Page<AgentRunActivity>> {
    return this.doList({ slug, run_id: run }, params as Record<string, unknown>);
  }

  /** Every activity on the run, oldest first, following pages automatically. */
  iterate<F extends Exclude<AgentRunActivityField, "all"> & keyof AgentRunActivity>(
    slug: string,
    run: string,
    params: Omit<ListAgentRunActivitiesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<AgentRunActivity, F | "id">>;
  /** Every activity on the run, oldest first, following pages automatically. */
  iterate(
    slug: string,
    run: string,
    params?: Omit<ListAgentRunActivitiesParams, "offset" | "count">
  ): AsyncGenerator<AgentRunActivity>;
  iterate(
    slug: string,
    run: string,
    params?: Omit<ListAgentRunActivitiesParams, "offset" | "count">
  ): AsyncGenerator<AgentRunActivity> {
    return this.doIterate({ slug, run_id: run }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<AgentRunActivityField, "all"> & keyof AgentRunActivity>(
    slug: string,
    run: string,
    activity: string,
    params: { fields: readonly F[]; expand?: readonly AgentRunActivityExpand[] }
  ): Promise<Pick<AgentRunActivity, F | "id">>;
  retrieve(
    slug: string,
    run: string,
    activity: string,
    params?: AgentRunActivityShapeParams
  ): Promise<AgentRunActivity>;
  retrieve(
    slug: string,
    run: string,
    activity: string,
    params?: AgentRunActivityShapeParams
  ): Promise<AgentRunActivity> {
    return this.doRetrieve({ slug, run_id: run, pk: activity }, params as Record<string, unknown>);
  }

  /**
   * Post an activity to the run.
   *
   * The run's agent (a bot token) posts its output — `thought`, `action`, `response`,
   * `elicitation` or `error`. A person posts only a `prompt`
   * (`{ type: "prompt", content: { type: "prompt", body } }`), which is mirrored into the
   * work item's thread as a reply; anything else from a person is a 400.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  create<F extends Exclude<AgentRunActivityField, "all"> & keyof AgentRunActivity>(
    slug: string,
    run: string,
    data: CreateAgentRunActivity,
    params: AgentRunActivityShapeParams & { fields: readonly F[] }
  ): Promise<Pick<AgentRunActivity, F | "id">>;
  /**
   * Post an activity to the run.
   *
   * The run's agent (a bot token) posts its output — `thought`, `action`, `response`,
   * `elicitation` or `error`. A person posts only a `prompt`
   * (`{ type: "prompt", content: { type: "prompt", body } }`), which is mirrored into the
   * work item's thread as a reply; anything else from a person is a 400.
   */
  create(
    slug: string,
    run: string,
    data: CreateAgentRunActivity,
    params?: AgentRunActivityShapeParams
  ): Promise<AgentRunActivity>;
  create(
    slug: string,
    run: string,
    data: CreateAgentRunActivity,
    params?: AgentRunActivityShapeParams
  ): Promise<AgentRunActivity> {
    return this.doCreate(data, { slug, run_id: run }, params as Record<string, unknown>);
  }
}
