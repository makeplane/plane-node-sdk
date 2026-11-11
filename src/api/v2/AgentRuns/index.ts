import { AgentRun, AgentRunStatus, AgentRunType, CreateAgentRun, UpdateAgentRun } from "../../../models/v2/AgentRun";
import { Page } from "../../../models/v2/common";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { AGENT_RUN_ID_NAMES, AgentRunNavigation, LoadedAgentRun, LoadedAgentRunRow } from "../loaded/AgentRun";
import { AgentRunActivities } from "./Activities";

export type AgentRunField = (typeof FIELDS)["runs_list"][number];
export type AgentRunOrderBy = (typeof ORDER_BY)["runs_list"][number];
/** `agent_user`, `creator`, `work_item`, `comment`, `source_comment` — each embedded beside its `*_id`. */
export type AgentRunExpand = (typeof EXPAND)["runs_list"][number];

export interface ListAgentRunsParams {
  fields?: readonly AgentRunField[];
  expand?: readonly AgentRunExpand[];
  agent_user_id?: string;
  project_id?: string;
  status?: AgentRunStatus;
  status__in?: readonly AgentRunStatus[];
  trigger_type?: string;
  type?: AgentRunType;
  /** Runs updated at or after this ISO 8601 timestamp — the polling watermark. */
  updated_at__gte?: string;
  work_item_id?: string;
  /** Defaults to `updated_at` (then `id`), which is cursor-safe. */
  order_by?: AgentRunOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface AgentRunShapeParams {
  fields?: readonly AgentRunField[];
  expand?: readonly AgentRunExpand[];
}

/**
 * Agent runs (api_v2), workspace-scoped: list, start, read, settle, stop. There is no
 * DELETE — a run is settled, not removed.
 *
 * Reached flat as `v2.workspaces.agentRuns.list(slug)`, or from a fetched workspace as
 * `workspace.agentRuns.list()`. A fetched run reaches its own activity log without repeating
 * either id: `(await v2.workspaces.agentRuns.retrieve(slug, run)).activities.list()`. The
 * cross-run feed is `v2.workspaces.agentRunActivities`.
 *
 * **Who sees what.** A bot token sees only its own runs. A person sees a run only if they
 * can see its work item; a run with no work item is visible to everyone allowed in.
 *
 * **Writes split by caller.** `update` is for the run's agent (a bot token) only — a person
 * gets a 403. `stop` is for a person only — a bot ends its own run with
 * `update(..., { status: "completed" })` or an `error` activity.
 *
 * **Polling.** An agent that finds its work through runs walks `list` with
 * `paginate: "cursor"` or polls `updated_at__gte`. A sync read holds back rows stamped in
 * the last 3 seconds until a later poll, so dedupe by `id`.
 */
export class AgentRuns extends LoadsNavigableRows<AgentRun, CreateAgentRun, UpdateAgentRun, AgentRunNavigation> {
  protected path = "/workspaces/{slug}/runs/";
  protected operations: Record<string, AnyOperationId> = {
    list: "runs_list",
    retrieve: "runs_retrieve",
    create: "runs_create",
    update: "runs_partial_update",
    stop: "runs_stop",
  };
  protected loadedIdNames = AGENT_RUN_ID_NAMES;

  /** One run's activity log — see {@link AgentRunActivities}. */
  public activities: AgentRunActivities;

  constructor(transport: V2Transport) {
    super(transport);
    this.activities = new AgentRunActivities(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<AgentRunNavigation> {
    const ids = meta.ids as [string, string];
    return {
      activities: () => owned(this.activities, ids, meta.idNames),
    };
  }

  /**
   * One page of `AgentRun` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<AgentRunField, "all"> & keyof AgentRun>(
    slug: string,
    params: ListAgentRunsParams & { fields: readonly F[] }
  ): Promise<Page<LoadedAgentRunRow<Pick<AgentRun, F | "id">>>>;
  /** One page of `AgentRun` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListAgentRunsParams): Promise<Page<LoadedAgentRun>>;
  async list(slug: string, params?: ListAgentRunsParams): Promise<Page<LoadedAgentRun>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every run the caller can see, following pages automatically. */
  iterate<F extends Exclude<AgentRunField, "all"> & keyof AgentRun>(
    slug: string,
    params: Omit<ListAgentRunsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedAgentRunRow<Pick<AgentRun, F | "id">>>;
  /** Every run the caller can see, following pages automatically. */
  iterate(slug: string, params?: Omit<ListAgentRunsParams, "offset" | "count">): AsyncGenerator<LoadedAgentRun>;
  iterate(slug: string, params?: Omit<ListAgentRunsParams, "offset" | "count">): AsyncGenerator<LoadedAgentRun> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<AgentRunField, "all"> & keyof AgentRun>(
    slug: string,
    run: string,
    params: { fields: readonly F[]; expand?: readonly AgentRunExpand[] }
  ): Promise<LoadedAgentRunRow<Pick<AgentRun, F | "id">>>;
  retrieve(slug: string, run: string, params?: AgentRunShapeParams): Promise<LoadedAgentRun>;
  async retrieve(slug: string, run: string, params?: AgentRunShapeParams): Promise<LoadedAgentRun> {
    const row = await this.doRetrieve({ slug, pk: run }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /**
   * Start a run of the agent named by `agent_slug` on an existing top-level comment; the
   * agent answers in that comment's thread. A person needs permission to comment on the
   * work item; a bot may start runs only for itself.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  create<F extends Exclude<AgentRunField, "all"> & keyof AgentRun>(
    slug: string,
    data: CreateAgentRun,
    params: AgentRunShapeParams & { fields: readonly F[] }
  ): Promise<LoadedAgentRunRow<Pick<AgentRun, F | "id">>>;
  /**
   * Start a run of the agent named by `agent_slug` on an existing top-level comment; the
   * agent answers in that comment's thread. A person needs permission to comment on the
   * work item; a bot may start runs only for itself.
   */
  create(slug: string, data: CreateAgentRun, params?: AgentRunShapeParams): Promise<LoadedAgentRun>;
  async create(slug: string, data: CreateAgentRun, params?: AgentRunShapeParams): Promise<LoadedAgentRun> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /**
   * The run's agent reports `title`, `summary` and usage, and settles the run with
   * `status: "completed"`. Bot tokens only: a person gets a 403.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  update<F extends Exclude<AgentRunField, "all"> & keyof AgentRun>(
    slug: string,
    run: string,
    data: UpdateAgentRun,
    params: AgentRunShapeParams & { fields: readonly F[] }
  ): Promise<LoadedAgentRunRow<Pick<AgentRun, F | "id">>>;
  /**
   * The run's agent reports `title`, `summary` and usage, and settles the run with
   * `status: "completed"`. Bot tokens only: a person gets a 403.
   */
  update(slug: string, run: string, data: UpdateAgentRun, params?: AgentRunShapeParams): Promise<LoadedAgentRun>;
  async update(slug: string, run: string, data: UpdateAgentRun, params?: AgentRunShapeParams): Promise<LoadedAgentRun> {
    const row = await this.doUpdate(data, { slug, pk: run }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /**
   * Ask the run to stop — what the web app's Stop button does. Records a `prompt` activity
   * with `signal: "stop"` (it appears in the activity feed) and answers the run in
   * `stopping`; the agent's next response settles it as `stopped`.
   *
   * People only: a bot token gets a 403. A run that has already ended, or is already
   * stopping, is a 409.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  stop<F extends Exclude<AgentRunField, "all"> & keyof AgentRun>(
    slug: string,
    run: string,
    params: AgentRunShapeParams & { fields: readonly F[] }
  ): Promise<LoadedAgentRunRow<Pick<AgentRun, F | "id">>>;
  /**
   * Ask the run to stop — what the web app's Stop button does. Records a `prompt` activity
   * with `signal: "stop"` (it appears in the activity feed) and answers the run in
   * `stopping`; the agent's next response settles it as `stopped`.
   *
   * People only: a bot token gets a 403. A run that has already ended, or is already
   * stopping, is a 409.
   */
  stop(slug: string, run: string, params?: AgentRunShapeParams): Promise<LoadedAgentRun>;
  async stop(slug: string, run: string, params?: AgentRunShapeParams): Promise<LoadedAgentRun> {
    const row = await this.doAction<AgentRun>("stop", { slug, pk: run }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }
}

export { AgentRunActivities } from "./Activities";
export type {
  AgentRunActivityExpand,
  AgentRunActivityField,
  AgentRunActivityFilters,
  AgentRunActivityOrderBy,
  AgentRunActivityShapeParams,
  ListAgentRunActivitiesParams,
} from "./Activities";
export { WorkspaceAgentRunActivities } from "./WorkspaceActivities";
export type {
  ListWorkspaceAgentRunActivitiesParams,
  WorkspaceAgentRunActivityExpand,
  WorkspaceAgentRunActivityField,
  WorkspaceAgentRunActivityOrderBy,
} from "./WorkspaceActivities";
