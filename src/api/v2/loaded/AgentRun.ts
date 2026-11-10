import type { AgentRun } from "../../../models/v2/AgentRun";
import type { AgentRunActivities } from "../AgentRuns/Activities";
import type { Loaded, Owned } from "../kernel/loaded";

/** The path ids a child of an agent run row needs, in URL order. Runs are workspace-scoped. */
export type AgentRunIds = [slug: string, run: string];

/** The parameter names behind {@link AgentRunIds}, in the same order. */
export const AGENT_RUN_ID_NAMES = ["slug", "run"] as const;

/**
 * Everything a fetched agent run can reach: its own activity log.
 *
 * The cross-run feed (`/runs/activities/`) is not here. It takes the slug alone, so it is a
 * child of the workspace — `v2.workspaces.agentRunActivities` — not of a run.
 */
export interface AgentRunNavigation {
  /**
   * AgentRunActivities with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly activities: Owned<AgentRunActivities, AgentRunIds>;
}

/** A fetched agent run row that is also the place its activity log lives. */
export type LoadedAgentRunRow<TRow> = Loaded<TRow, AgentRunNavigation>;

export type LoadedAgentRun = LoadedAgentRunRow<AgentRun>;
