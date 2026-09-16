export type AuditLogActorType = "user" | "api_token" | "system" | "anonymous";

export type AuditLogCategory =
  | "auth"
  | "member"
  | "role"
  | "settings"
  | "integration"
  | "webhook"
  | "security"
  | "instance"
  | "project";

export type AuditLogOutcome = "success" | "failure";

export type AuditLogSource = "platform" | "api" | "graphql" | "auth" | "system";

/** Read-only external audit-log entry; hash-chain fields stay private to the internal API. Every field except `id` is optional. */
export interface AuditLog {
  id: string;
  event_id?: string;
  event_name?: string;
  category?: AuditLogCategory;
  outcome?: AuditLogOutcome;
  source?: AuditLogSource;
  actor_id?: string | null;
  actor_type?: AuditLogActorType;
  actor_display_name?: string;
  actor_email?: string;
  target_id?: string;
  target_type?: string;
  target_display_name?: string;
  workspace_id?: string;
  project_id?: string;
  old_value?: unknown;
  new_value?: unknown;
  metadata?: unknown;
  reason?: string;
  ip_address?: string | null;
  user_agent?: string;
  sequence_number?: number;
  created_at?: string;
}
