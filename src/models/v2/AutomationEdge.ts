/** An edge between two nodes in an automation's graph — flows `source_node_id` to `target_node_id`. Every field except `id` is optional. */
export interface AutomationEdge {
  id: string;
  created_at?: string;
  created_by_id?: string | null;
  /** Order for evaluation when multiple edges leave the same node. */
  execution_order?: number;
  source_node_id?: string;
  target_node_id?: string;
  updated_at?: string;
  version_id?: string;
}

/** POST body. `source_node_id` and `target_node_id` are required by the API. */
export interface CreateAutomationEdge {
  source_node_id: string;
  target_node_id: string;
  execution_order?: number;
}

/** PATCH body — every field optional. */
export type UpdateAutomationEdge = Partial<CreateAutomationEdge>;
