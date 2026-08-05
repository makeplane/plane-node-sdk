/**
 * Minimal workflow shape for embedding (pickers, pins)
 */
export interface WorkflowLite {
  id?: string;
  name?: string;
}

/**
 * Minimal project reference in governance payloads
 */
export interface GovernanceProjectRef {
  id?: string;
  name?: string;
}

/**
 * One allowlist/mandate row, enriched with its in-use projects.
 * `locked` marks workflows a project's pick already uses — a constrained
 * allowlist must retain them.
 */
export interface GovernanceAllowlistEntry {
  workflow_id?: string;
  name?: string;
  in_use_by_projects: GovernanceProjectRef[];
  locked?: boolean;
}

export type TypeGovernanceMode = "any" | "constrained" | "required";

/**
 * Governance settings for a work item type: mode, required workflow, and
 * allowlist. Pins are served by the dedicated pins endpoints.
 */
export interface TypeGovernance {
  mode?: TypeGovernanceMode;
  required_workflow?: WorkflowLite | null;
  allowlist: GovernanceAllowlistEntry[];
}

/**
 * Request model for changing a type's governance mode.
 *
 * - `any`: no restriction; `workflow_ids`/`required_workflow_id` unused.
 * - `constrained`: `workflow_ids` is the allowlist (in-use workflows are
 *   locked in). Removing picks in use requires `acknowledge` and may need a
 *   `state_mapping` for orphaned work items.
 * - `required`: `required_workflow_id` mandates one workflow everywhere;
 *   requires `acknowledge` and may need a `state_mapping`.
 */
export interface UpdateTypeGovernance {
  mode: TypeGovernanceMode;
  workflow_ids?: string[];
  required_workflow_id?: string;
  acknowledge?: boolean;
  state_mapping?: Record<string, string>;
}

/**
 * Request model for previewing a governance mode change (no writes)
 */
export interface TypeGovernancePreviewRequest {
  mode: TypeGovernanceMode;
  workflow_ids?: string[];
  required_workflow_id?: string;
}

/**
 * Dry-run impact report for a governance change or workflow fallback
 */
export interface GovernancePreview {
  total?: number;
  type_total?: number;
  per_state?: Record<string, unknown>[];
}

/**
 * A single project-to-workflow pin for a work item type
 */
export interface WorkItemTypeWorkflowPin {
  id?: string;
  project?: GovernanceProjectRef;
  workflow?: WorkflowLite;
}

/**
 * Request model for pinning a workflow across one or more projects
 */
export interface CreateWorkItemTypeWorkflowPins {
  workflow_id: string;
  project_ids: string[];
}

/**
 * A pickable workflow option for a project's type
 */
export interface WorkflowOption {
  workflow_id?: string;
  name?: string;
}

/**
 * One active type's governance pill, effective workflow, and pickable
 * options within a project
 */
export interface ProjectTypeWorkflow {
  type_id?: string;
  /** any | constrained | required | pinned */
  governance?: string;
  allowlist_count?: number;
  allowlist_total?: number;
  effective_workflow_id?: string;
  source?: string;
  options: WorkflowOption[];
}

/**
 * Request model for setting a project's workflow pick for a type.
 * Orphan-gated: work items whose state falls outside the target chain must
 * be covered by `state_mapping`.
 */
export interface SetProjectWorkflowPick {
  workflow_id: string;
  state_mapping?: Record<string, string>;
}

/**
 * Response of setting a project's workflow pick: the workflow now in effect
 */
export interface ProjectWorkflowPickResult {
  workflow_id?: string;
}

/**
 * Request model for previewing the project workflow fallback.
 * Provide `new_type_id` (+ current `type_id`) for a re-type preview, or
 * `workflow_id` (+ `type_id`) for a workflow-switch preview.
 */
export interface WorkflowFallbackPreviewRequest {
  type_id?: string;
  new_type_id?: string;
  workflow_id?: string;
}
