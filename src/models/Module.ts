import { BaseModel } from "./common";

export interface CreateModuleRequest {
  name: string;
  description?: string;
  start_date?: string;
  target_date?: string;
  status?: ModuleStatusEnum;
  lead?: string;
  members?: string[];
  external_source?: string;
  external_id?: string;
}

export interface UpdateModuleRequest {
  name?: string;
  description?: string;
  start_date?: string;
  target_date?: string;
  status?: ModuleStatusEnum;
  lead?: string;
  members?: string[];
  external_source?: string;
  external_id?: string;
}

export interface ModuleWorkItem {
  id?: string;
  sub_issues_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at: string;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  module?: string;
  issue: string;
}

export interface Module extends BaseModel {
  name: string;
  description?: string;
  description_text?: any;
  description_html?: any;
  start_date?: string;
  target_date?: string;
  status?: ModuleStatusEnum;
  view_props?: any;
  sort_order?: number;
  archived_at?: string;
  logo_props?: any;
  project: string;
  workspace: string;
  lead?: string;
  members?: string[];
}

export type ModuleStatusEnum =
  | "backlog"
  | "planned"
  | "in-progress"
  | "paused"
  | "completed"
  | "cancelled";

export interface ListModulesParamsRequest {
  limit?: number;
  offset?: number;
}
