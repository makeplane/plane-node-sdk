/** Node kind: `trigger` starts a run, `action` performs a side effect, `condition` branches. */
export type AutomationNodeType = "trigger" | "action" | "condition";

/** A node in an automation's trigger/action/condition graph (api_v2). Every field except `id` is optional. */
export interface AutomationNode {
  id: string;
  /** Node-specific configuration and parameters — shape varies by `handler_name`. */
  config?: unknown;
  created_at?: string;
  created_by_id?: string | null;
  /** Name of the handler class (e.g. `"record_created"`, `"send_email"`). */
  handler_name?: string;
  is_enabled?: boolean;
  /** Last time this scheduled trigger was dispatched. */
  last_triggered_at?: string | null;
  name?: string;
  /** Next scheduled execution time (UTC). Only set for scheduled triggers. */
  next_scheduled_at?: string | null;
  node_type?: AutomationNodeType;
  updated_at?: string;
  version_id?: string;
}

/** POST body. `handler_name`, `name`, and `node_type` are required by the API. */
export interface CreateAutomationNode {
  handler_name: string;
  name: string;
  node_type: AutomationNodeType;
  config?: unknown;
  is_enabled?: boolean;
}

/** PATCH body — every field optional. */
export type UpdateAutomationNode = Partial<CreateAutomationNode>;

/** Response of a webhook-trigger node's `regenerate-webhook-secret` action — the new secret, shown once. */
export interface AutomationWebhookSecret {
  secret: string;
}
