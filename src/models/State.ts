/**
 * State model interfaces
 */

export type State = {
  id: string;
  name: string;
  description?: string;
  color: string;
  sequence?: number;
  group?: GroupEnum;
  is_triage?: boolean;
  default?: boolean;
  project?: string;
  workspace?: string;
  external_source?: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  updated_by: string;
};

export type CreateState = {
  name: string;
  description?: string;
  color: string;
  sequence?: number;
  group?: GroupEnum;
  is_triage?: boolean;
  default?: boolean;
  external_source?: string;
  external_id?: string;
};

export type UpdateState = Partial<CreateState>;

export type ListStatesParams = {
  project?: string;
  limit?: number;
  offset?: number;
};

export type GroupEnum = "backlog" | "unstarted" | "started" | "completed" | "cancelled" | "triage";
