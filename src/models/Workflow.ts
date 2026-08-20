import { BaseModel } from "./common";

/**
 * Workflow model interfaces
 */
export interface Workflow extends BaseModel {
  name: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
  work_item_type_ids?: string[];
  project: string;
  workspace: string;
}

export type CreateWorkflow = Pick<Workflow, "name" | "description" | "is_active" | "work_item_type_ids">;

export type UpdateWorkflow = Partial<CreateWorkflow>;

export interface AttachWorkflowStates {
  state_ids: string[];
}

export interface WorkflowTransition extends BaseModel {
  state_id?: string;
  transition_state_id?: string;
  type?: string;
  member_ids?: string[];
  pre_rules?: Record<string, unknown>[];
  post_rules?: Record<string, unknown>[];
  workflow_state_id?: string;
}

export type CreateWorkflowTransition = Required<Pick<WorkflowTransition, "state_id" | "transition_state_id">> &
  Partial<Pick<WorkflowTransition, "type" | "member_ids" | "pre_rules" | "post_rules">>;

export type UpdateWorkflowTransition = Partial<Pick<WorkflowTransition, "pre_rules" | "post_rules">>;

/**
 * A state's membership row within a workflow chain. `id` is the membership
 * row's ID and `state_id` the state's own — the inverse of
 * `WorkspaceWorkflowState`, whose rows are keyed by state ID.
 */
export interface WorkflowState {
  id?: string;
  state_id?: string;
  workflow_id?: string;
  type?: string;
  allow_issue_creation?: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UpdateWorkflowState = Partial<Pick<WorkflowState, "type" | "allow_issue_creation" | "is_default">>;

/**
 * One workflow activity/audit entry
 */
export interface WorkflowActivity {
  id?: string;
  verb?: string;
  field?: string;
  old_value?: unknown;
  new_value?: unknown;
  actor?: unknown;
  created_at?: string;
}

/**
 * Request model for approving or rejecting a work item's pending workflow
 * transition
 */
export interface SubmitWorkItemApproval {
  type: "approve" | "reject";
}

/**
 * Response of a work item workflow approval: the state the item moved to
 */
export interface WorkItemApprovalResult {
  state_id?: string;
}

/**
 * A validation/action hook attached to a workflow transition.
 * `config.secret` is masked for send_webhook handlers; the one-shot
 * `secret_plaintext` appears on create and regenerate responses only.
 */
export interface WorkflowTransitionHook {
  id?: string;
  phase?: string;
  handler_name?: string;
  rule_type?: string;
  execution_order?: number;
  is_enabled?: boolean;
  config?: Record<string, unknown>;
  secret_plaintext?: string;
}

/**
 * Request model for creating a workflow transition hook. `phase` and
 * `handler_name` are immutable post-create.
 */
export type CreateWorkflowTransitionHook = Pick<WorkflowTransitionHook, "phase" | "handler_name" | "config"> &
  Partial<Pick<WorkflowTransitionHook, "is_enabled">>;

export type UpdateWorkflowTransitionHook = Partial<Pick<WorkflowTransitionHook, "config" | "is_enabled">>;
