import { Assignee, BaseModel } from './common';
import { Label } from './Label';

/**
 * WorkItem model interfaces
 */
export interface WorkItem extends BaseModel {
  id: string;
  name: string;
  sequence_id: number;
  description_html?: string;
  project: string;
  assignee?: string;
  labels?: string[] | Label[];
  assignees?: string[] | Assignee[];
  type?: string;
  estimate_point?: string;
  state?: string;
  parent?: string;
  is_draft?: boolean;
  archived_at?: string;
  completed_at?: string;
  sort_order?: number;
  target_date?: string;
  start_date?: string;
  priority?: string;
  description_stripped?: string;
  description_binary?: string;
}

export interface CreateWorkItem {
  name: string;
  description_html?: string;
  state?: string;
  assignees?: string[];
  labels?: string[];
}

export interface UpdateWorkItem {
  name?: string;
  description_html?: string;
  state?: string;
  assignees?: string[];
  labels?: string[];
}

export interface ListWorkItemsParams {
  project?: string;
  state?: string;
  assignee?: string;
  limit?: number;
  offset?: number;
}
