import { BaseModel } from "./common";

/**
 * Agent run status enum
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

/**
 * Agent run type enum
 */
export type AgentRunType = "comment_thread";

/**
 * Agent run activity signal enum
 */
export type AgentRunActivitySignal = "auth_request" | "continue" | "select" | "stop";

/**
 * Agent run activity type enum
 */
export type AgentRunActivityType = "action" | "elicitation" | "error" | "prompt" | "response" | "thought";

/**
 * Agent Run interface
 */
export interface AgentRun extends BaseModel {
  agent_user: string;
  comment?: string;
  source_comment?: string;
  creator: string;
  stopped_at?: string;
  stopped_by?: string;
  started_at: string;
  ended_at?: string;
  external_link?: string;
  issue?: string;
  workspace: string;
  project?: string;
  status: AgentRunStatus;
  error_metadata?: Record<string, any>;
  type: AgentRunType;
}

/**
 * Create agent run request interface
 */
export interface CreateAgentRunRequest {
  agent_slug: string;
  issue?: string;
  project?: string;
  comment?: string;
  source_comment?: string;
  external_link?: string;
  type?: AgentRunType;
}

/**
 * Agent run activity content for action type
 */
export interface AgentRunActivityActionContent {
  type: "action";
  action: string;
  parameters: Record<string, string>;
}

/**
 * Agent run activity content for other types
 */
export interface AgentRunActivityTextContent {
  type: Exclude<AgentRunActivityType, "action">;
  body: string;
}

/**
 * Agent run activity content
 */
export type AgentRunActivityContent = AgentRunActivityActionContent | AgentRunActivityTextContent;

/**
 * Agent Run Activity interface
 */
export interface AgentRunActivity extends BaseModel {
  agent_run: string;
  content: AgentRunActivityContent;
  content_metadata?: Record<string, any>;
  ephemeral: boolean;
  signal: AgentRunActivitySignal;
  signal_metadata?: Record<string, any>;
  comment?: string;
  actor?: string;
  type: AgentRunActivityType;
  project?: string;
  workspace: string;
}

/**
 * Create agent run activity request interface
 */
export interface CreateAgentRunActivityRequest {
  content: AgentRunActivityContent;
  content_metadata?: Record<string, any>;
  signal?: AgentRunActivitySignal;
  signal_metadata?: Record<string, any>;
  type: Exclude<AgentRunActivityType, "prompt">;
  project?: string;
}
