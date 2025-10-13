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
