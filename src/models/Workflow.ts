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

export interface CreateWorkflow {
  name: string;
  description?: string;
  is_active?: boolean;
  work_item_type_ids?: string[];
}

export interface UpdateWorkflow {
  name?: string;
  description?: string;
  is_active?: boolean;
  work_item_type_ids?: string[];
}

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

export interface CreateWorkflowTransition {
  state_id: string;
  transition_state_id: string;
  type?: string;
  member_ids?: string[];
  pre_rules?: Record<string, unknown>[];
  post_rules?: Record<string, unknown>[];
}

export interface UpdateWorkflowTransition {
  pre_rules?: Record<string, unknown>[];
  post_rules?: Record<string, unknown>[];
}
