import { PaginatedResponse } from "./common";

/**
 * One state row in a workspace workflow's chain.
 *
 * Rows are keyed by catalog state IDs, so `id` is the state's own ID — the
 * inverse of the project-scoped `WorkflowState` (see `./Workflow`), where
 * `id` is the membership row's ID and `state_id` is the state's. The API
 * never sends `state_id` on these rows; treat `id` as the state ID.
 *
 * `transitions` embeds the outgoing transitions (with approvers) when the
 * payload is the full chain projection.
 */
export interface WorkspaceWorkflowState {
  id?: string;
  state_id?: string;
  type?: string;
  allow_issue_creation?: boolean;
  is_default?: boolean;
  sequence?: number;
  transitions?: Record<string, unknown>[];
}

/**
 * Workspace workflow model (catalog list row / detail superset).
 *
 * The list endpoint returns the count fields only; `retrieve` adds the full
 * `states` chain, `project_ids`/`work_item_type_ids` usage, and
 * `referenced_resources`.
 */
export interface WorkspaceWorkflow {
  id?: string;
  name: string;
  description?: string;
  is_default?: boolean;
  is_active?: boolean;
  workspace_id?: string;
  project_id?: string;
  states_count?: number;
  projects_count?: number;
  work_item_types_count?: number;
  project_ids?: string[];
  work_item_type_ids?: string[];
  states?: WorkspaceWorkflowState[];
  referenced_resources?: unknown;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export type PaginatedWorkspaceWorkflowResponse = PaginatedResponse<WorkspaceWorkflow>;

/**
 * Request model for creating a workspace workflow (a draft until its chain
 * is configured via the states endpoints)
 */
export type CreateWorkspaceWorkflow = {
  name: string;
  description?: string;
};

/**
 * Request model for updating workspace workflow metadata
 */
export type UpdateWorkspaceWorkflow = Partial<{
  name: string;
  description: string;
  is_active: boolean;
}>;

/**
 * Request model for appending catalog states to a workflow's chain
 */
export interface AddWorkspaceWorkflowStates {
  state_ids: string[];
}

/**
 * Request model for updating a chain membership row.
 * Changing `type` (e.g. to/from `approval`) removes the row's existing
 * transitions server-side.
 */
export type UpdateWorkspaceWorkflowState = Partial<{
  type: string;
  allow_issue_creation: boolean;
  is_default: boolean;
}>;

/**
 * Request body for removing a state from a chain.
 * Orphan-gated: every work item stranded by the removal must be covered by
 * `state_mapping` (409 with an orphan report otherwise). Removing the default
 * state requires `new_default_state_id`.
 */
export interface RemoveWorkspaceWorkflowState {
  new_default_state_id?: string;
  state_mapping?: Record<string, string>;
}

/**
 * One project resolving to a workflow in the usage report
 */
export interface WorkspaceWorkflowUsageProject {
  project_id?: string;
  name?: string;
  types: (string | null)[];
}

/**
 * Usage report for a workspace workflow: projects/types resolving to it, plus
 * the types mandating or allowing it
 */
export interface WorkspaceWorkflowUsage {
  projects: WorkspaceWorkflowUsageProject[];
  types_mandating: string[];
  types_allowing: string[];
}

/**
 * State transition within a workspace workflow
 */
export interface WorkspaceWorkflowTransition {
  id?: string;
  workflow_state_id?: string;
  transition_state_id?: string;
  rejection_state_id?: string;
  required_approvals?: number;
  member_ids?: string[];
  pre_hooks?: Record<string, unknown>[];
  post_hooks?: Record<string, unknown>[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Request model for creating a workspace workflow transition.
 * `state_id` is the chain state the transition starts from; `member_ids` are
 * the approvers (approval-type states only).
 */
export type CreateWorkspaceWorkflowTransition = {
  state_id: string;
  transition_state_id: string;
  rejection_state_id?: string;
  required_approvals?: number;
  member_ids?: string[];
};

/**
 * Request model for updating a workspace workflow transition
 */
export type UpdateWorkspaceWorkflowTransition = Partial<{
  transition_state_id: string;
  rejection_state_id: string;
  required_approvals: number;
  member_ids: string[];
}>;
