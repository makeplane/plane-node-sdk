import { PriorityEnum } from "./common";

export interface Epic {
  id?: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  point?: number;
  name: string;
  description?: any;
  description_html?: string;
  description_stripped?: string;
  description_binary?: string;
  priority?: PriorityEnum;
  start_date?: string;
  target_date?: string;
  sequence_id?: number;
  sort_order?: number;
  completed_at?: string;
  archived_at?: string;
  is_draft?: boolean;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  project: string;
  workspace: string;
  parent?: string;
  state?: string;
  estimate_point?: string;
  type?: string;
  assignees?: string[];
  labels?: string[];
}

export interface CreateEpic {
  name: string;
  description_html?: string;
  state_id?: string;
  parent_id?: string;
  assignee_ids?: string[];
  label_ids?: string[];
  priority?: PriorityEnum;
  start_date?: string;
  target_date?: string;
  estimate_point?: string;
  external_source?: string;
  external_id?: string;
}

export interface UpdateEpic {
  name?: string;
  description_html?: string;
  state_id?: string;
  parent_id?: string;
  assignee_ids?: string[];
  label_ids?: string[];
  priority?: PriorityEnum;
  start_date?: string;
  target_date?: string;
  estimate_point?: string;
  external_source?: string;
  external_id?: string;
}

export interface AddEpicWorkItems {
  work_item_ids: string[];
}

export interface EpicIssue {
  id: string;
  type_id?: string | null;
  parent?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  point?: number | null;
  name: string;
  description_html?: string;
  description_stripped?: string;
  description_binary?: string | null;
  priority?: PriorityEnum;
  start_date?: string | null;
  target_date?: string | null;
  sequence_id?: number;
  sort_order?: number;
  completed_at?: string | null;
  archived_at?: string | null;
  last_activity_at?: string;
  is_draft?: boolean;
  external_source?: string | null;
  external_id?: string | null;
  created_by?: string;
  updated_by?: string | null;
  project?: string;
  workspace?: string;
  state?: string;
  estimate_point?: string | null;
  type?: string | null;
  assignees?: string[];
  labels?: string[];
}
