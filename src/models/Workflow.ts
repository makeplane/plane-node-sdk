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
