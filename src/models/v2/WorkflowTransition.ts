/** A transition edge between two workflow states. Every field except `id` is optional. */
export interface WorkflowTransition {
  id: string;
  /** The source `WorkflowState` id this transition hangs off. */
  workflow_state_id?: string;
  /** The destination project State id. */
  transition_state_id?: string | null;
  /** The project State id a rejected approval falls back to. */
  rejection_state_id?: string | null;
  required_approvals?: number | null;
  /** Approver member ids, only meaningful on an approval-type source state. */
  member_ids?: string[];
  created_at?: string;
  created_by_id?: string | null;
}

/** Create/update a transition. `state_id` (source state's project State id) is required on create, ignored on update. */
export interface CreateWorkflowTransition {
  state_id: string;
  transition_state_id?: string | null;
  rejection_state_id?: string | null;
  required_approvals?: number | null;
  member_ids?: string[];
}

/** PATCH body — `state_id` does not apply to an existing transition. */
export type UpdateWorkflowTransition = Partial<Omit<CreateWorkflowTransition, "state_id">>;
