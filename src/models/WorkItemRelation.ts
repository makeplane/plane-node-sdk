export interface WorkItemRelation {
  id?: string;
  project_id?: string;
  sequence_id?: number;
  relation_type?: string;
  name?: string;
  type_id?: string;
  is_epic?: boolean;
  state_id?: string;
  priority?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}

export type IssueRelationCreateRelationTypeEnum =
  | "blocking"
  | "blocked_by"
  | "duplicate"
  | "relates_to"
  | "start_before"
  | "start_after"
  | "finish_before"
  | "finish_after";

export interface WorkItemRelationCreateRequest {
  relation_type: IssueRelationCreateRelationTypeEnum; // Type of relationship between work items `blocking` - Blocking `blocked_by` - Blocked By `duplicate` - Duplicate `relates_to` - Relates To `start_before` - Start Before `start_after` - Start After `finish_before` - Finish Before `finish_after` - Finish After
  issues: string[]; // Array of work item IDs to create relations with
}

export interface WorkItemRelationRemoveRequest {
  related_issue: string; // ID of the related work item to remove relation with
}

export interface WorkItemRelationResponse {
  blocking: string[]; // List of issue IDs that are blocking this issue
  blocked_by: string[]; // List of issue IDs that this issue is blocked by
  duplicate: string[]; // List of issue IDs that are duplicates of this issue
  relates_to: string[]; // List of issue IDs that relate to this issue
  start_after: string[]; // List of issue IDs that start after this issue
  start_before: string[]; // List of issue IDs that start before this issue
  finish_after: string[]; // List of issue IDs that finish after this issue
  finish_before: string[]; // List of issue IDs that finish before this issue
}
