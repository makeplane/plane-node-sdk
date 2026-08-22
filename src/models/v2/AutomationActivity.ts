/** Read-only audit-log entry for a change to an automation, node, or edge (api_v2). Every field except `id` is optional. */
export interface AutomationActivity {
  id: string;
  actor_id?: string | null;
  automation_edge_id?: string | null;
  automation_id?: string;
  automation_node_id?: string | null;
  automation_run_id?: string | null;
  automation_scope?: string;
  automation_version_id?: string | null;
  created_at?: string;
  epoch?: number | null;
  field?: string | null;
  new_identifier?: string | null;
  new_value?: string | null;
  node_execution_id?: string | null;
  old_identifier?: string | null;
  old_value?: string | null;
  verb?: string;
}
