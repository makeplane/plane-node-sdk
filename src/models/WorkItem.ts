import { WorkItemType } from "./WorkItemType";
import { BaseModel, PriorityEnum } from "./common";
import { Module } from "./Module";
import { Label } from "./Label";
import { Project } from "./Project";
import { State } from "./State";
import { User } from "./User";

/**
 * WorkItem model interfaces
 */
export interface WorkItemBase extends BaseModel {
  name: string;
  sequence_id: number;
  description_html?: string;
  project: string;
  labels?: string[];
  assignees?: string[];
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
  priority?: PriorityEnum;
  description_stripped?: string;
  description_binary?: string;
}

// 1. Define expandable fields mapping (single source of truth)
type WorkItemExpandableFields = {
  type: WorkItemType;
  module: Module;
  labels: Label[];
  assignees: User[];
  state: State;
  project: Project;
};

export type WorkItemExpandableFieldName = keyof WorkItemExpandableFields;

// Smart type that expands based on what's requested
// Fallback to WorkItemBase if Expanded is never or empty array
export type WorkItem<Expanded extends WorkItemExpandableFieldName = never> = [Expanded] extends [never]
  ? WorkItemBase
  : Omit<WorkItemBase, Expanded> & {
      [K in Expanded]: K extends keyof WorkItemExpandableFields ? WorkItemExpandableFields[K] : never;
    };

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

export interface WorkItemActivity {
  id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  verb?: string;
  field?: string;
  old_value?: string;
  new_value?: string;
  comment?: string;
  attachments?: string[];
  old_identifier?: string;
  new_identifier?: string;
  epoch?: number;
  project: string;
  workspace: string;
  issue?: string;
  issue_comment?: string;
  actor?: string;
}

export interface WorkItemSearch {
  issues: WorkItemSearchItem[];
}

export interface WorkItemSearchItem {
  id: string; // Issue ID
  name: string; // Issue name
  sequence_id: string; // Issue sequence ID
  project__identifier: string; // Project identifier
  project_id: string; // Project ID
  workspace__slug: string; // Workspace slug
}
