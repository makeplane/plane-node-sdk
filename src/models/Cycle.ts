import { BaseModel, TimezoneEnum } from "./common";

export interface TransferCycleWorkItemRequest {
  new_cycle_id: string; // ID of the target cycle to transfer issues to
}

export interface CycleWorkItem {
  id?: string;
  sub_issues_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at: string;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  issue: string;
  cycle?: string;
}

export interface Cycle extends BaseModel {
  name: string;
  description?: string;
  // YYYY-MM-DD format
  start_date?: string;
  // YYYY-MM-DD format
  end_date?: string;
  view_props?: any;
  sort_order?: number;
  progress_snapshot?: any;
  archived_at?: string;
  logo_props?: any;
  timezone?: TimezoneEnum;
  version?: number;
  project: string;
  workspace: string;
  owned_by: string;
}

export interface CreateCycleRequest {
  name: string;
  description?: string;
  // YYYY-MM-DD format
  start_date?: string;
  // YYYY-MM-DD format
  end_date?: string;
  owned_by: string;
  external_source?: string;
  external_id?: string;
  timezone?: TimezoneEnum;
  project_id: string;
}

export interface UpdateCycleRequest {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  owned_by?: string;
  external_source?: string;
  external_id?: string;
  timezone?: TimezoneEnum;
}

export interface AddWorkItemsToCycleRequest {
  issues: string[]; // List of issue IDs to add to the cycle
}

export interface RemoveCycleIssuesRequestRequest {
  issues: string[]; // List of issue IDs to remove from the cycle
}

export interface TransferCycleIssueRequestRequest {
  new_cycle_id: string; // ID of the target cycle to transfer issues to
}
