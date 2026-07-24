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
  parent?: string;
  estimate_point?: string;
  type?: string;
  module?: string;
  target_date?: string;
  start_date?: string;
  priority?: PriorityEnum;
}

export interface UpdateWorkItem {
  name?: string;
  description_html?: string;
  state?: string;
  assignees?: string[];
  labels?: string[];
  parent?: string;
  estimate_point?: string;
  type?: string;
  module?: string;
  target_date?: string;
  start_date?: string;
  priority?: PriorityEnum;
}

export interface ListWorkItemsParams {
  project?: string;
  state?: string;
  assignee?: string;
  limit?: number;
  offset?: number;
  pql?: string;
  /** JSON-encoded filters object (workspace/project list endpoints) */
  filters?: string;
  order_by?: string;
  cursor?: string;
  per_page?: number;
  /** Comma-separated field list to return */
  fields?: string;
  /** Comma-separated relations to expand */
  expand?: string;
  [key: string]: unknown;
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

/**
 * Filter condition for advanced search.
 * Either a leaf condition (e.g. { state_id: "..." }) or a group with "and"/"or" keys.
 */
export type AdvancedSearchFilter = {
  and?: AdvancedSearchFilter[];
  or?: AdvancedSearchFilter[];
  [key: string]: unknown;
};

/**
 * Request body for advanced work item search.
 */
export interface AdvancedSearchWorkItem {
  query?: string;
  filters?: AdvancedSearchFilter;
  limit?: number;
}

/**
 * Result item from advanced work item search.
 */
export interface AdvancedSearchResult {
  id: string;
  name: string;
  sequence_id: number;
  project_identifier: string;
  project_id: string;
  workspace_id: string;
  type_id?: string | null;
  state_id?: string | null;
  priority?: string | null;
  target_date?: string | null;
  start_date?: string | null;
}

// ─── Workspace Work Item Count ───────────────────────────────────────────────

/**
 * Query params for workspace-wide work item count.
 */
export interface WorkItemCountParams {
  /** JSON-encoded filters object */
  filters?: string;
  /** PQL query string */
  pql?: string;
  group_by?: string;
  sub_group_by?: string;
  [key: string]: unknown;
}

export interface WorkItemCountEntry {
  count: number;
  sub_grouped_counts?: Record<string, { count: number }>;
}

/**
 * Response for GET /workspaces/{slug}/work-items/count.
 * grouped_counts keys are raw ORM field values ("None" for empty).
 */
export interface WorkItemCountResponse {
  grouped_by?: string | null;
  sub_grouped_by?: string | null;
  total_count: number;
  grouped_counts?: Record<string, WorkItemCountEntry>;
}

// ─── Work Item Dependencies ──────────────────────────────────────────────────

/**
 * Built-in dependency directions, from the perspective of the work item.
 */
export type DependencyType =
  | "blocking"
  | "blocked_by"
  | "start_before"
  | "start_after"
  | "finish_before"
  | "finish_after";

/**
 * Work item with an injected relation_type label.
 */
export interface WorkItemWithRelationType {
  id: string;
  name?: string;
  sequence_id?: number;
  project_id?: string;
  state_id?: string;
  priority?: string;
  type_id?: string;
  is_epic?: boolean;
  relation_type?: string;
  [key: string]: unknown;
}

/**
 * Response for GET .../work-items/{id}/dependencies/ grouped by direction.
 */
export interface WorkItemDependencyResponse {
  blocking: WorkItemWithRelationType[];
  blocked_by: WorkItemWithRelationType[];
  start_before: WorkItemWithRelationType[];
  start_after: WorkItemWithRelationType[];
  finish_before: WorkItemWithRelationType[];
  finish_after: WorkItemWithRelationType[];
}

/**
 * Request model for creating work item dependency relations.
 */
export interface CreateWorkItemDependencyRequest {
  /** Dependency direction from the perspective of this work item */
  relation_type: DependencyType;
  /** UUIDs of work items to create dependencies with (min 1) */
  work_item_ids: string[];
}

// ─── Work Item Custom Relations ──────────────────────────────────────────────

/**
 * Request model for creating a custom (definition-based) work item relation.
 */
export interface CreateWorkItemCustomRelationRequest {
  /** UUID of the workspace relation definition */
  relation_definition_id: string;
  /** The outward or inward label of the definition (controls directionality) */
  relation_definition_type: string;
  /** UUIDs of work items to create the relation with (min 1) */
  work_item_ids: string[];
}
