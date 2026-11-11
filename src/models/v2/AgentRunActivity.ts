/**
 * The golden's `AgentRunActivityTypeEnum`. An agent posts `thought`, `action`, `response`,
 * `elicitation` or `error`; a person posts only `prompt`.
 */
export type AgentRunActivityType = "action" | "elicitation" | "error" | "prompt" | "response" | "thought";

/** The golden's `SignalEnum` — an out-of-band instruction riding on an activity. */
export type AgentRunActivitySignal = "auth_request" | "continue" | "select" | "stop" | "upgrade";

/** `content` of an `action` activity: the action's name and its string parameters. */
export interface AgentRunActivityActionContent {
  type: "action";
  action: string;
  parameters: Record<string, string>;
}

/** `content` of every other activity type: a body (HTML for a `prompt` or `response`). */
export interface AgentRunActivityTextContent {
  type: Exclude<AgentRunActivityType, "action">;
  body: string;
}

/**
 * An activity's `content`. The golden leaves it untyped; the server validates this shape
 * against `content.type`: an action carries `action` plus string `parameters`, anything
 * else a string `body`.
 */
export type AgentRunActivityContent = AgentRunActivityActionContent | AgentRunActivityTextContent;

/**
 * One entry in an agent run's activity log. Read-only once written — there is no PATCH or
 * DELETE. Every field except `id` is optional — `?fields=` can omit any of them.
 * `?expand=actor` embeds the actor beside `actor_id`.
 */
export interface AgentRunActivity {
  id: string;
  actor_id?: string | null;
  agent_run_id?: string;
  /** The work item comment this activity was mirrored to, or null. */
  comment_id?: string | null;
  content?: AgentRunActivityContent;
  /** Stored and echoed verbatim. */
  content_metadata?: unknown;
  created_at?: string;
  created_by_id?: string | null;
  /** An ephemeral activity is shown while the run is live and not kept in the thread. */
  ephemeral?: boolean;
  project_id?: string | null;
  signal?: AgentRunActivitySignal;
  signal_metadata?: unknown;
  type?: AgentRunActivityType;
  updated_at?: string;
  updated_by_id?: string | null;
}

/**
 * POST body. `type` is required.
 *
 * Who may send what is split by caller: the run's agent (a bot token) posts its output
 * (`thought`, `action`, `response`, `elicitation`, `error`) with any of the fields below;
 * a person may post only `{ type: "prompt", content: { type: "prompt", body } }` — no
 * `signal`, `ephemeral` or `comment_id` — and the prompt is mirrored into the work item's
 * thread as a reply.
 */
export interface CreateAgentRunActivity {
  type: AgentRunActivityType;
  content?: AgentRunActivityContent;
  content_metadata?: unknown;
  ephemeral?: boolean;
  signal?: AgentRunActivitySignal;
  /** An `auth_request` signal reads `signal_metadata.url`. */
  signal_metadata?: unknown;
  comment_id?: string | null;
}
