/**
 * The golden's `AgentRunStatusEnum`. `stopping` is transient: a person asked the run to
 * stop and the agent has not answered yet — its next response settles it as `stopped`.
 */
export type AgentRunStatus =
  | "created"
  | "in_progress"
  | "awaiting"
  | "completed"
  | "stopping"
  | "stopped"
  | "failed"
  | "stale";

/** The golden's `AgentRunTypeEnum` — what started the run. */
export type AgentRunType = "comment_thread" | "scheduled" | "assignment" | "event_triggered" | "integration_triggered";

/** The golden's `AgentRunUpdateStatusEnum`: the only status an agent may PATCH its run to. */
export type AgentRunUpdateStatus = "completed";

/**
 * One run of an agent — the session an agent works through after it is mentioned in or
 * assigned to a work item, or triggered by a schedule or integration. Every field except
 * `id` is optional — `?fields=` can omit any of them.
 *
 * Read-only on the wire apart from {@link CreateAgentRun}/{@link UpdateAgentRun}: a run is
 * settled, never deleted. `?expand=` embeds `agent_user`, `creator`, `work_item`,
 * `comment` and `source_comment` as objects *beside* their `*_id` fields.
 */
export interface AgentRun {
  id: string;
  /** The agent's bot user — the actor its activities are posted as. */
  agent_user_id?: string;
  /** The comment that is the run's thread root, or null. */
  comment_id?: string | null;
  created_at?: string;
  created_by_id?: string | null;
  creator_id?: string | null;
  /** Free-form usage the agent reports on settle; the golden leaves it untyped. */
  credit_usage?: unknown;
  ended_at?: string | null;
  error_metadata?: unknown | null;
  external_link?: string | null;
  external_trigger_id?: string | null;
  external_trigger_source?: string | null;
  native_agent_id?: string | null;
  project_id?: string | null;
  /** The comment that triggered the run (a mention), when it differs from {@link AgentRun.comment_id}. */
  source_comment_id?: string | null;
  started_at?: string;
  status?: AgentRunStatus;
  stopped_at?: string | null;
  stopped_by_id?: string | null;
  summary?: string | null;
  title?: string | null;
  /** Free-form usage the agent reports on settle; the golden leaves it untyped. */
  token_usage?: unknown;
  trigger_type?: string | null;
  type?: AgentRunType;
  updated_at?: string;
  updated_by_id?: string | null;
  /** Null for a run with no work item (a scheduled native-agent run, say). */
  work_item_id?: string | null;
}

/** POST body. Starts a run of the agent named by `agent_slug` on an existing top-level comment. */
export interface CreateAgentRun {
  /** The agent's application slug — its readable key, so no id lookup comes first. */
  agent_slug: string;
  /** A top-level comment (not a reply) to start the run on; the agent answers in its thread. */
  comment_id: string;
  title?: string | null;
  summary?: string | null;
  /** A link out to the agent's own view of the run; an empty string clears it. */
  external_link?: string | null;
}

/** PATCH body — every field optional. Only the run's agent (a bot token) may send it; a person gets a 403. */
export interface UpdateAgentRun {
  title?: string | null;
  summary?: string | null;
  token_usage?: unknown;
  credit_usage?: unknown;
  /** Settle the run. `completed` is the only value accepted here. */
  status?: AgentRunUpdateStatus;
}
