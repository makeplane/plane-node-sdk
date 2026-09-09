/** A workflow state's role in the graph — `WorkflowStateType` in the golden. */
export type WorkflowStateKind = string;

/** A project State attached to a workflow graph. Every field except `id` is optional. */
export interface WorkflowState {
  id: string;
  /** The project State this workflow state wraps. */
  state_id?: string;
  workflow_id?: string;
  type?: WorkflowStateKind;
  allow_issue_creation?: boolean;
  is_default?: boolean;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body to attach project states — diverges from the golden's documented schema; actual body is `{state_ids: [...]}`, returns an array. */
export interface WorkflowStateAttachRequest {
  state_ids: string[];
}

/** PATCH body for an existing workflow state (type / allow_issue_creation / is_default). */
export interface UpdateWorkflowState {
  type?: string;
  allow_issue_creation?: boolean;
  is_default?: boolean;
}
