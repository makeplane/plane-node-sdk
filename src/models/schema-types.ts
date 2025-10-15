/**
 * This file was auto-generated from OpenAPI schema components.
 * Contains only the schema types, no API paths or operations.
 */

export type AccessBd4Enum = "INTERNAL" | "EXTERNAL";

export interface Customer {
  id?: string;
  deleted_at?: string;
  customer_request_count?: number;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: any;
  description_html?: string;
  description_stripped?: string;
  description_binary?: string;
  email?: string;
  website_url?: string;
  logo_props?: any;
  domain?: string;
  employees?: number;
  stage?: string;
  contract_status?: string;
  revenue?: string;
  created_by?: string;
  updated_by?: string;
  logo_asset?: string;
  workspace?: string;
}

export interface CustomerProperty {
  id?: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  display_name: string;
  description?: string;
  logo_props?: any;
  sort_order?: number;
  property_type: PropertyTypeEnum;
  relation_type?: RelationTypeF5eEnum;
  is_required?: boolean;
  default_value?: string[];
  settings?: any;
  is_active?: boolean;
  is_multi?: boolean;
  validation_rules?: any;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  workspace?: string;
}

export interface CustomerRequest {
  name: string;
  description?: any;
  description_html?: string;
  description_stripped?: string;
  email?: string;
  website_url?: string;
  logo_props?: any;
  domain?: string;
  employees?: number;
  stage?: string;
  contract_status?: string;
  revenue?: string;
  created_by?: string;
  updated_by?: string;
  logo_asset?: string;
}

export interface CustomerRequestRequest {
  name: string;
  description?: any;
  description_html?: string;
  link?: string;
  work_item_ids?: string[];
}

export interface Cycle {
  id?: string;
  total_issues?: number;
  cancelled_issues?: number;
  completed_issues?: number;
  started_issues?: number;
  unstarted_issues?: number;
  backlog_issues?: number;
  total_estimates?: number;
  completed_estimates?: number;
  started_estimates?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  view_props?: any;
  sort_order?: number;
  external_source?: string;
  external_id?: string;
  progress_snapshot?: any;
  archived_at?: string;
  logo_props?: any;
  timezone?: TimezoneEnum;
  version?: number;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  owned_by?: string;
}

export interface CycleCreateRequest {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  owned_by: string;
  external_source?: string;
  external_id?: string;
  timezone?: TimezoneEnum;
}

export interface CycleIssue {
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

export interface CycleIssueRequestRequest {
  issues: string[]; // List of issue IDs to add to the cycle
}

export interface CycleLite {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  view_props?: any;
  sort_order?: number;
  external_source?: string;
  external_id?: string;
  progress_snapshot?: any;
  archived_at?: string;
  logo_props?: any;
  timezone?: TimezoneEnum;
  version?: number;
  created_by?: string;
  updated_by?: string;
  project: string;
  workspace: string;
  owned_by: string;
}

export type EntityTypeEnum = "USER_AVATAR" | "USER_COVER";

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

export interface GenericAssetUploadRequest {
  name: string; // Original filename of the asset
  type?: string; // MIME type of the file
  size: number; // File size in bytes
  project_id?: string; // UUID of the project to associate with the asset
  external_id?: string; // External identifier for the asset (for integration tracking)
  external_source?: string; // External source system (for integration tracking)
}

export type GroupEnum =
  | "backlog"
  | "unstarted"
  | "started"
  | "completed"
  | "cancelled"
  | "triage";

export interface IntakeIssue {
  id: string;
  issue_detail?: WorkItemExpand;
  inbox?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  status?: IntakeWorkItemStatusEnum;
  snoozed_till?: string;
  source?: string;
  source_email?: string;
  external_source?: string;
  external_id?: string;
  extra?: any;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  intake: string;
  issue?: string;
  duplicate_to?: string;
}

export interface IntakeIssueCreateRequest {
  issue: WorkItemForIntakeRequest; // Issue data for the intake issue
  intake?: string;
  status?: IntakeWorkItemStatusEnum;
  snoozed_till?: string;
  duplicate_to?: string;
  source?: string;
  source_email?: string;
}

export type IntakeWorkItemStatusEnum = number;

export interface WorkItem {
  id?: string;
  type_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  point?: number;
  name: string;
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
  project?: string;
  workspace?: string;
  parent?: string;
  state?: string;
  estimate_point?: string;
  type?: string;
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

export interface WorkItemAttachment {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  attributes?: any;
  asset: string;
  entity_type?: string;
  entity_identifier?: string;
  is_deleted?: boolean;
  is_archived?: boolean;
  external_id?: string;
  external_source?: string;
  size?: number;
  is_uploaded?: boolean;
  storage_metadata?: any;
  created_by?: string;
  updated_by?: string;
  user?: string;
  workspace?: string;
  draft_issue?: string;
  project?: string;
  issue?: string;
  comment?: string;
  page?: string;
}

export interface WorkItemAttachmentUploadRequest {
  name: string; // Original filename of the asset
  type?: string; // MIME type of the file
  size: number; // File size in bytes
  external_id?: string; // External identifier for the asset (for integration tracking)
  external_source?: string; // External source system (for integration tracking)
}

export interface WorkItemComment {
  id?: string;
  is_member?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  comment_stripped?: string;
  comment_html?: string;
  attachments?: string[];
  access?: AccessBd4Enum;
  external_source?: string;
  external_id?: string;
  edited_at?: string;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  issue?: string;
  actor?: string;
}

export interface WorkItemCommentCreateRequest {
  comment_json?: any;
  comment_html?: string;
  access?: AccessBd4Enum;
  external_source?: string;
  external_id?: string;
}

export interface WorkItemDetail {
  id?: string;
  assignees: UserLite[];
  labels: Label[];
  type_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  point?: number;
  name: string;
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
  project?: string;
  workspace?: string;
  parent?: string;
  state?: string;
  estimate_point?: string;
  type?: string;
}

export interface WorkItemExpand {
  id?: string;
  cycle?: CycleLite;
  module?: ModuleLite;
  labels?: string;
  assignees?: string;
  state?: StateLite;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
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
  project?: string;
  workspace?: string;
  parent?: string;
  estimate_point?: string;
  type?: string;
}

export interface WorkItemForIntakeRequest {
  name: string;
  description_html?: string;
  priority?: PriorityEnum;
}

export interface WorkItemLink {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  title?: string;
  url: string;
  metadata?: any;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  issue?: string;
}

export interface WorkItemLinkCreateRequest {
  url: string;
}

export interface WorkItemPropertyAPI {
  id?: string;
  deleted_at?: string;
  relation_type?: RelationTypeF5eEnum;
  created_at?: string;
  updated_at?: string;
  name?: string;
  display_name: string;
  description?: string;
  logo_props?: any;
  sort_order?: number;
  property_type: PropertyTypeEnum;
  is_required?: boolean;
  default_value?: string[];
  settings?: any;
  is_active?: boolean;
  is_multi?: boolean;
  validation_rules?: any;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  workspace?: string;
  project?: string;
  issue_type?: string;
}

export interface WorkItemPropertyAPIRequest {
  relation_type?: RelationTypeF5eEnum;
  display_name: string;
  description?: string;
  property_type: PropertyTypeEnum;
  is_required?: boolean;
  default_value?: string[];
  settings?: any;
  is_active?: boolean;
  is_multi?: boolean;
  validation_rules?: any;
  external_source?: string;
  external_id?: string;
}

export interface WorkItemPropertyOptionAPI {
  id?: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  sort_order?: number;
  description?: string;
  logo_props?: any;
  is_active?: boolean;
  is_default?: boolean;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  workspace?: string;
  project?: string;
  property?: string;
  parent?: string;
}

export interface WorkItemPropertyOptionAPIRequest {
  name: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
  external_source?: string;
  external_id?: string;
  parent?: string;
}

export interface WorkItemPropertyValueAPI {
  id?: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  value_text?: string;
  value_boolean?: boolean;
  value_decimal?: number;
  value_datetime?: string;
  value_uuid?: string;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  workspace?: string;
  project?: string;
  issue: string;
  property: string;
  value_option?: string;
}

export interface WorkItemPropertyValueAPIDetail {
  property_id: string; // The ID of the issue property
  values: string[]; // List of aggregated property values for the given property
}

export interface WorkItemPropertyValueAPIRequest {
  value_text?: string;
  value_boolean?: boolean;
  value_decimal?: number;
  value_datetime?: string;
  value_uuid?: string;
  external_source?: string;
  external_id?: string;
  issue: string;
  property: string;
  value_option?: string;
}

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

export interface WorkItemRequest {
  assignees?: string[];
  labels?: string[];
  type_id?: string;
  deleted_at?: string;
  point?: number;
  name: string;
  description_html?: string;
  description_stripped?: string;
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
  parent?: string;
  state?: string;
  estimate_point?: string;
  type?: string;
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

export interface WorkItemTypeAPI {
  id?: string;
  deleted_at?: string;
  project_ids?: string[];
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: string;
  logo_props?: any;
  is_epic?: boolean;
  is_default?: boolean;
  is_active?: boolean;
  level?: number;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  workspace?: string;
}

export interface WorkItemTypeAPIRequest {
  project_ids?: string[];
  name: string;
  description?: string;
  is_epic?: boolean;
  is_active?: boolean;
  external_source?: string;
  external_id?: string;
}

export interface WorkItemWorkLogAPI {
  id?: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  duration?: number;
  created_by?: string;
  updated_by?: string;
  project_id?: string;
  workspace_id?: string;
  logged_by?: string;
}

export interface WorkItemWorkLogAPIRequest {
  description?: string;
  duration?: number;
  created_by?: string;
  updated_by?: string;
}

export interface Label {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  name: string;
  description?: string;
  color?: string;
  sort_order?: number;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  workspace?: string;
  project?: string;
  parent?: string;
}

export interface LabelCreateUpdateRequest {
  name: string;
  color?: string;
  description?: string;
  external_source?: string;
  external_id?: string;
  parent?: string;
  sort_order?: number;
}

export interface Module {
  id?: string;
  total_issues?: number;
  cancelled_issues?: number;
  completed_issues?: number;
  started_issues?: number;
  unstarted_issues?: number;
  backlog_issues?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  name: string;
  description?: string;
  description_text?: any;
  description_html?: any;
  start_date?: string;
  target_date?: string;
  status?: ModuleStatusEnum;
  view_props?: any;
  sort_order?: number;
  external_source?: string;
  external_id?: string;
  archived_at?: string;
  logo_props?: any;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  lead?: string;
}

export interface ModuleCreateRequest {
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

export interface ModuleIssue {
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

export interface ModuleIssueRequestRequest {
  issues: string[]; // List of issue IDs to add to the module
}

export interface ModuleLite {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at: string;
  name: string;
  description?: string;
  description_text?: any;
  description_html?: any;
  start_date?: string;
  target_date?: string;
  status?: ModuleStatusEnum;
  view_props?: any;
  sort_order?: number;
  external_source?: string;
  external_id?: string;
  archived_at?: string;
  logo_props?: any;
  created_by?: string;
  updated_by?: string;
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

export type NetworkEnum = number;

export interface PageCreateAPI {
  id?: string;
  name: string;
  owned_by?: string;
  access?: PageCreateAPIAccessEnum;
  color?: string;
  is_locked?: boolean;
  archived_at?: string;
  workspace?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  view_props?: any;
  logo_props?: any;
  external_id?: string;
  external_source?: string;
  parent_id?: string;
  description_html: string;
}

export type PageCreateAPIAccessEnum = number;

export interface PageCreateAPIRequest {
  name: string;
  access?: PageCreateAPIAccessEnum;
  color?: string;
  is_locked?: boolean;
  archived_at?: string;
  view_props?: any;
  logo_props?: any;
  external_id?: string;
  external_source?: string;
  description_html: string;
}

export interface PageDetailAPI {
  id?: string;
  name?: string;
  description_stripped?: string;
  created_at?: string;
  updated_at?: string;
  owned_by?: string;
  anchor?: string;
  workspace?: string;
  projects?: string[];
}

export interface PaginatedArchivedCycleResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: Cycle[];
}

export interface PaginatedArchivedModuleResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: Module[];
}

export interface PaginatedCycleIssueResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: CycleIssue[];
}

export interface PaginatedCycleResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: Cycle[];
}

export interface PaginatedEpicResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: Epic[];
}

export interface PaginatedIntakeIssueResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: IntakeIssue[];
}

export interface PaginatedIssueActivityDetailResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: WorkItemActivity[];
}

export interface PaginatedIssueActivityResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: WorkItemActivity[];
}

export interface PaginatedIssueCommentResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: WorkItemComment[];
}

export interface PaginatedIssueLinkDetailResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: WorkItemLink[];
}

export interface PaginatedIssueLinkResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: WorkItemLink[];
}

export interface PaginatedLabelResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: Label[];
}

export interface PaginatedModuleIssueResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: WorkItem[];
}

export interface PaginatedModuleResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: Module[];
}

export interface PaginatedProjectResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: Project[];
}

export interface PaginatedStateResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: State[];
}

export interface PaginatedWorkItemResponse {
  grouped_by: string;
  sub_grouped_by: string;
  total_count: number;
  next_cursor: string;
  prev_cursor: string;
  next_page_results: boolean;
  prev_page_results: boolean;
  count: number;
  total_pages: number;
  total_results: number;
  extra_stats: string;
  results: WorkItem[];
}

export interface PatchedAssetUpdateRequest {
  attributes?: any; // Additional attributes to update for the asset
}

export interface PatchedCustomerPropertyRequest {
  display_name?: string;
  description?: string;
  logo_props?: any;
  sort_order?: number;
  property_type?: PropertyTypeEnum;
  relation_type?: RelationTypeF5eEnum;
  is_required?: boolean;
  default_value?: string[];
  settings?: any;
  is_active?: boolean;
  is_multi?: boolean;
  validation_rules?: any;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
}

export interface PatchedCustomerRequest {
  name?: string;
  description?: any;
  description_html?: string;
  description_stripped?: string;
  email?: string;
  website_url?: string;
  logo_props?: any;
  domain?: string;
  employees?: number;
  stage?: string;
  contract_status?: string;
  revenue?: string;
  created_by?: string;
  updated_by?: string;
  logo_asset?: string;
}

export interface PatchedCustomerRequestRequest {
  name?: string;
  description?: any;
  description_html?: string;
  link?: string;
  work_item_ids?: string[];
}

export interface PatchedCycleUpdateRequest {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  owned_by?: string;
  external_source?: string;
  external_id?: string;
  timezone?: TimezoneEnum;
}

export interface PatchedGenericAssetUpdateRequest {
  is_uploaded?: boolean; // Whether the asset has been successfully uploaded
}

export interface PatchedIntakeIssueUpdateRequest {
  status?: IntakeWorkItemStatusEnum;
  snoozed_till?: string;
  duplicate_to?: string;
  source?: string;
  source_email?: string;
  issue?: WorkItemForIntakeRequest; // Issue data to update in the intake issue
}

export interface PatchedIssueCommentCreateRequest {
  comment_json?: any;
  comment_html?: string;
  access?: AccessBd4Enum;
  external_source?: string;
  external_id?: string;
}

export interface PatchedIssueLinkUpdateRequest {
  url?: string;
}

export interface PatchedIssuePropertyAPIRequest {
  relation_type?: RelationTypeF5eEnum;
  display_name?: string;
  description?: string;
  property_type?: PropertyTypeEnum;
  is_required?: boolean;
  default_value?: string[];
  settings?: any;
  is_active?: boolean;
  is_multi?: boolean;
  validation_rules?: any;
  external_source?: string;
  external_id?: string;
}

export interface PatchedIssuePropertyOptionAPIRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
  external_source?: string;
  external_id?: string;
  parent?: string;
}

export interface PatchedIssueRequest {
  assignees?: string[];
  labels?: string[];
  type_id?: string;
  deleted_at?: string;
  point?: number;
  name?: string;
  description_html?: string;
  description_stripped?: string;
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
  parent?: string;
  state?: string;
  estimate_point?: string;
  type?: string;
}

export interface PatchedIssueTypeAPIRequest {
  project_ids?: string[];
  name?: string;
  description?: string;
  is_epic?: boolean;
  is_active?: boolean;
  external_source?: string;
  external_id?: string;
}

export interface PatchedIssueWorkLogAPIRequest {
  description?: string;
  duration?: number;
  created_by?: string;
  updated_by?: string;
}

export interface PatchedLabelCreateUpdateRequest {
  name?: string;
  color?: string;
  description?: string;
  external_source?: string;
  external_id?: string;
  parent?: string;
  sort_order?: number;
}

export interface PatchedModuleUpdateRequest {
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

export interface PatchedProjectUpdateRequest {
  name?: string;
  description?: string;
  project_lead?: string;
  default_assignee?: string;
  identifier?: string;
  icon_prop?: any;
  emoji?: string;
  cover_image?: string;
  module_view?: boolean;
  cycle_view?: boolean;
  issue_views_view?: boolean;
  page_view?: boolean;
  intake_view?: boolean;
  guest_view_all_features?: boolean;
  archive_in?: number;
  close_in?: number;
  timezone?: TimezoneEnum;
  logo_props?: any;
  external_source?: string;
  external_id?: string;
  is_issue_type_enabled?: boolean;
  default_state?: string;
  estimate?: string;
}

export interface PatchedStateRequest {
  name?: string;
  description?: string;
  color?: string;
  sequence?: number;
  group?: GroupEnum;
  is_triage?: boolean;
  default?: boolean;
  external_source?: string;
  external_id?: string;
}

export type PriorityEnum = "urgent" | "high" | "medium" | "low" | "none";

export interface Project {
  id?: string;
  total_members?: number;
  total_cycles?: number;
  total_modules?: number;
  is_member?: boolean;
  sort_order?: number;
  member_role?: number;
  is_deployed?: boolean;
  cover_image_url?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  name: string;
  description?: string;
  description_text?: any;
  description_html?: any;
  network?: NetworkEnum;
  identifier: string;
  emoji?: string;
  icon_prop?: any;
  module_view?: boolean;
  cycle_view?: boolean;
  issue_views_view?: boolean;
  page_view?: boolean;
  intake_view?: boolean;
  is_time_tracking_enabled?: boolean;
  is_issue_type_enabled?: boolean;
  guest_view_all_features?: boolean;
  cover_image?: string;
  archive_in?: number;
  close_in?: number;
  logo_props?: any;
  archived_at?: string;
  timezone?: TimezoneEnum;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  workspace?: string;
  default_assignee?: string;
  project_lead?: string;
  cover_image_asset?: string;
  estimate?: string;
  default_state?: string;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  project_lead?: string;
  default_assignee?: string;
  identifier: string;
  icon_prop?: any;
  emoji?: string;
  cover_image?: string;
  module_view?: boolean;
  cycle_view?: boolean;
  issue_views_view?: boolean;
  page_view?: boolean;
  intake_view?: boolean;
  guest_view_all_features?: boolean;
  archive_in?: number;
  close_in?: number;
  timezone?: TimezoneEnum;
  logo_props?: any;
  external_source?: string;
  external_id?: string;
  is_issue_type_enabled?: boolean;
}

export interface ProjectWorklogSummary {
  issue_id: string; // ID of the work item
  duration: number; // Total duration logged for this work item in seconds
}

export type PropertyTypeEnum =
  | "TEXT"
  | "DATETIME"
  | "DECIMAL"
  | "BOOLEAN"
  | "OPTION"
  | "RELATION"
  | "URL"
  | "EMAIL"
  | "FILE";

export type RelationTypeF5eEnum = "ISSUE" | "USER";

export interface State {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  name: string;
  description?: string;
  color: string;
  sequence?: number;
  group?: GroupEnum;
  is_triage?: boolean;
  default?: boolean;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
}

export interface StateLite {
  id?: string;
  name?: string;
  color?: string;
  group?: GroupEnum;
}

export interface StateRequest {
  name: string;
  description?: string;
  color: string;
  sequence?: number;
  group?: GroupEnum;
  is_triage?: boolean;
  default?: boolean;
  external_source?: string;
  external_id?: string;
}

export type TimezoneEnum =
  | "Africa/Abidjan"
  | "Africa/Accra"
  | "Africa/Addis_Ababa"
  | "Africa/Algiers"
  | "Africa/Asmara"
  | "Africa/Bamako"
  | "Africa/Bangui"
  | "Africa/Banjul"
  | "Africa/Bissau"
  | "Africa/Blantyre"
  | "Africa/Brazzaville"
  | "Africa/Bujumbura"
  | "Africa/Cairo"
  | "Africa/Casablanca"
  | "Africa/Ceuta"
  | "Africa/Conakry"
  | "Africa/Dakar"
  | "Africa/Dar_es_Salaam"
  | "Africa/Djibouti"
  | "Africa/Douala"
  | "Africa/El_Aaiun"
  | "Africa/Freetown"
  | "Africa/Gaborone"
  | "Africa/Harare"
  | "Africa/Johannesburg"
  | "Africa/Juba"
  | "Africa/Kampala"
  | "Africa/Khartoum"
  | "Africa/Kigali"
  | "Africa/Kinshasa"
  | "Africa/Lagos"
  | "Africa/Libreville"
  | "Africa/Lome"
  | "Africa/Luanda"
  | "Africa/Lubumbashi"
  | "Africa/Lusaka"
  | "Africa/Malabo"
  | "Africa/Maputo"
  | "Africa/Maseru"
  | "Africa/Mbabane"
  | "Africa/Mogadishu"
  | "Africa/Monrovia"
  | "Africa/Nairobi"
  | "Africa/Ndjamena"
  | "Africa/Niamey"
  | "Africa/Nouakchott"
  | "Africa/Ouagadougou"
  | "Africa/Porto-Novo"
  | "Africa/Sao_Tome"
  | "Africa/Tripoli"
  | "Africa/Tunis"
  | "Africa/Windhoek"
  | "America/Adak"
  | "America/Anchorage"
  | "America/Anguilla"
  | "America/Antigua"
  | "America/Araguaina"
  | "America/Argentina/Buenos_Aires"
  | "America/Argentina/Catamarca"
  | "America/Argentina/Cordoba"
  | "America/Argentina/Jujuy"
  | "America/Argentina/La_Rioja"
  | "America/Argentina/Mendoza"
  | "America/Argentina/Rio_Gallegos"
  | "America/Argentina/Salta"
  | "America/Argentina/San_Juan"
  | "America/Argentina/San_Luis"
  | "America/Argentina/Tucuman"
  | "America/Argentina/Ushuaia"
  | "America/Aruba"
  | "America/Asuncion"
  | "America/Atikokan"
  | "America/Bahia"
  | "America/Bahia_Banderas"
  | "America/Barbados"
  | "America/Belem"
  | "America/Belize"
  | "America/Blanc-Sablon"
  | "America/Boa_Vista"
  | "America/Bogota"
  | "America/Boise"
  | "America/Cambridge_Bay"
  | "America/Campo_Grande"
  | "America/Cancun"
  | "America/Caracas"
  | "America/Cayenne"
  | "America/Cayman"
  | "America/Chicago"
  | "America/Chihuahua"
  | "America/Ciudad_Juarez"
  | "America/Costa_Rica"
  | "America/Creston"
  | "America/Cuiaba"
  | "America/Curacao"
  | "America/Danmarkshavn"
  | "America/Dawson"
  | "America/Dawson_Creek"
  | "America/Denver"
  | "America/Detroit"
  | "America/Dominica"
  | "America/Edmonton"
  | "America/Eirunepe"
  | "America/El_Salvador"
  | "America/Fort_Nelson"
  | "America/Fortaleza"
  | "America/Glace_Bay"
  | "America/Goose_Bay"
  | "America/Grand_Turk"
  | "America/Grenada"
  | "America/Guadeloupe"
  | "America/Guatemala"
  | "America/Guayaquil"
  | "America/Guyana"
  | "America/Halifax"
  | "America/Havana"
  | "America/Hermosillo"
  | "America/Indiana/Indianapolis"
  | "America/Indiana/Knox"
  | "America/Indiana/Marengo"
  | "America/Indiana/Petersburg"
  | "America/Indiana/Tell_City"
  | "America/Indiana/Vevay"
  | "America/Indiana/Vincennes"
  | "America/Indiana/Winamac"
  | "America/Inuvik"
  | "America/Iqaluit"
  | "America/Jamaica"
  | "America/Juneau"
  | "America/Kentucky/Louisville"
  | "America/Kentucky/Monticello"
  | "America/Kralendijk"
  | "America/La_Paz"
  | "America/Lima"
  | "America/Los_Angeles"
  | "America/Lower_Princes"
  | "America/Maceio"
  | "America/Managua"
  | "America/Manaus"
  | "America/Marigot"
  | "America/Martinique"
  | "America/Matamoros"
  | "America/Mazatlan"
  | "America/Menominee"
  | "America/Merida"
  | "America/Metlakatla"
  | "America/Mexico_City"
  | "America/Miquelon"
  | "America/Moncton"
  | "America/Monterrey"
  | "America/Montevideo"
  | "America/Montserrat"
  | "America/Nassau"
  | "America/New_York"
  | "America/Nome"
  | "America/Noronha"
  | "America/North_Dakota/Beulah"
  | "America/North_Dakota/Center"
  | "America/North_Dakota/New_Salem"
  | "America/Nuuk"
  | "America/Ojinaga"
  | "America/Panama"
  | "America/Paramaribo"
  | "America/Phoenix"
  | "America/Port-au-Prince"
  | "America/Port_of_Spain"
  | "America/Porto_Velho"
  | "America/Puerto_Rico"
  | "America/Punta_Arenas"
  | "America/Rankin_Inlet"
  | "America/Recife"
  | "America/Regina"
  | "America/Resolute"
  | "America/Rio_Branco"
  | "America/Santarem"
  | "America/Santiago"
  | "America/Santo_Domingo"
  | "America/Sao_Paulo"
  | "America/Scoresbysund"
  | "America/Sitka"
  | "America/St_Barthelemy"
  | "America/St_Johns"
  | "America/St_Kitts"
  | "America/St_Lucia"
  | "America/St_Thomas"
  | "America/St_Vincent"
  | "America/Swift_Current"
  | "America/Tegucigalpa"
  | "America/Thule"
  | "America/Tijuana"
  | "America/Toronto"
  | "America/Tortola"
  | "America/Vancouver"
  | "America/Whitehorse"
  | "America/Winnipeg"
  | "America/Yakutat"
  | "Antarctica/Casey"
  | "Antarctica/Davis"
  | "Antarctica/DumontDUrville"
  | "Antarctica/Macquarie"
  | "Antarctica/Mawson"
  | "Antarctica/McMurdo"
  | "Antarctica/Palmer"
  | "Antarctica/Rothera"
  | "Antarctica/Syowa"
  | "Antarctica/Troll"
  | "Antarctica/Vostok"
  | "Arctic/Longyearbyen"
  | "Asia/Aden"
  | "Asia/Almaty"
  | "Asia/Amman"
  | "Asia/Anadyr"
  | "Asia/Aqtau"
  | "Asia/Aqtobe"
  | "Asia/Ashgabat"
  | "Asia/Atyrau"
  | "Asia/Baghdad"
  | "Asia/Bahrain"
  | "Asia/Baku"
  | "Asia/Bangkok"
  | "Asia/Barnaul"
  | "Asia/Beirut"
  | "Asia/Bishkek"
  | "Asia/Brunei"
  | "Asia/Chita"
  | "Asia/Choibalsan"
  | "Asia/Colombo"
  | "Asia/Damascus"
  | "Asia/Dhaka"
  | "Asia/Dili"
  | "Asia/Dubai"
  | "Asia/Dushanbe"
  | "Asia/Famagusta"
  | "Asia/Gaza"
  | "Asia/Hebron"
  | "Asia/Ho_Chi_Minh"
  | "Asia/Hong_Kong"
  | "Asia/Hovd"
  | "Asia/Irkutsk"
  | "Asia/Jakarta"
  | "Asia/Jayapura"
  | "Asia/Jerusalem"
  | "Asia/Kabul"
  | "Asia/Kamchatka"
  | "Asia/Karachi"
  | "Asia/Kathmandu"
  | "Asia/Khandyga"
  | "Asia/Kolkata"
  | "Asia/Krasnoyarsk"
  | "Asia/Kuala_Lumpur"
  | "Asia/Kuching"
  | "Asia/Kuwait"
  | "Asia/Macau"
  | "Asia/Magadan"
  | "Asia/Makassar"
  | "Asia/Manila"
  | "Asia/Muscat"
  | "Asia/Nicosia"
  | "Asia/Novokuznetsk"
  | "Asia/Novosibirsk"
  | "Asia/Omsk"
  | "Asia/Oral"
  | "Asia/Phnom_Penh"
  | "Asia/Pontianak"
  | "Asia/Pyongyang"
  | "Asia/Qatar"
  | "Asia/Qostanay"
  | "Asia/Qyzylorda"
  | "Asia/Riyadh"
  | "Asia/Sakhalin"
  | "Asia/Samarkand"
  | "Asia/Seoul"
  | "Asia/Shanghai"
  | "Asia/Singapore"
  | "Asia/Srednekolymsk"
  | "Asia/Taipei"
  | "Asia/Tashkent"
  | "Asia/Tbilisi"
  | "Asia/Tehran"
  | "Asia/Thimphu"
  | "Asia/Tokyo"
  | "Asia/Tomsk"
  | "Asia/Ulaanbaatar"
  | "Asia/Urumqi"
  | "Asia/Ust-Nera"
  | "Asia/Vientiane"
  | "Asia/Vladivostok"
  | "Asia/Yakutsk"
  | "Asia/Yangon"
  | "Asia/Yekaterinburg"
  | "Asia/Yerevan"
  | "Atlantic/Azores"
  | "Atlantic/Bermuda"
  | "Atlantic/Canary"
  | "Atlantic/Cape_Verde"
  | "Atlantic/Faroe"
  | "Atlantic/Madeira"
  | "Atlantic/Reykjavik"
  | "Atlantic/South_Georgia"
  | "Atlantic/St_Helena"
  | "Atlantic/Stanley"
  | "Australia/Adelaide"
  | "Australia/Brisbane"
  | "Australia/Broken_Hill"
  | "Australia/Darwin"
  | "Australia/Eucla"
  | "Australia/Hobart"
  | "Australia/Lindeman"
  | "Australia/Lord_Howe"
  | "Australia/Melbourne"
  | "Australia/Perth"
  | "Australia/Sydney"
  | "Canada/Atlantic"
  | "Canada/Central"
  | "Canada/Eastern"
  | "Canada/Mountain"
  | "Canada/Newfoundland"
  | "Canada/Pacific"
  | "Europe/Amsterdam"
  | "Europe/Andorra"
  | "Europe/Astrakhan"
  | "Europe/Athens"
  | "Europe/Belgrade"
  | "Europe/Berlin"
  | "Europe/Bratislava"
  | "Europe/Brussels"
  | "Europe/Bucharest"
  | "Europe/Budapest"
  | "Europe/Busingen"
  | "Europe/Chisinau"
  | "Europe/Copenhagen"
  | "Europe/Dublin"
  | "Europe/Gibraltar"
  | "Europe/Guernsey"
  | "Europe/Helsinki"
  | "Europe/Isle_of_Man"
  | "Europe/Istanbul"
  | "Europe/Jersey"
  | "Europe/Kaliningrad"
  | "Europe/Kirov"
  | "Europe/Kyiv"
  | "Europe/Lisbon"
  | "Europe/Ljubljana"
  | "Europe/London"
  | "Europe/Luxembourg"
  | "Europe/Madrid"
  | "Europe/Malta"
  | "Europe/Mariehamn"
  | "Europe/Minsk"
  | "Europe/Monaco"
  | "Europe/Moscow"
  | "Europe/Oslo"
  | "Europe/Paris"
  | "Europe/Podgorica"
  | "Europe/Prague"
  | "Europe/Riga"
  | "Europe/Rome"
  | "Europe/Samara"
  | "Europe/San_Marino"
  | "Europe/Sarajevo"
  | "Europe/Saratov"
  | "Europe/Simferopol"
  | "Europe/Skopje"
  | "Europe/Sofia"
  | "Europe/Stockholm"
  | "Europe/Tallinn"
  | "Europe/Tirane"
  | "Europe/Ulyanovsk"
  | "Europe/Vaduz"
  | "Europe/Vatican"
  | "Europe/Vienna"
  | "Europe/Vilnius"
  | "Europe/Volgograd"
  | "Europe/Warsaw"
  | "Europe/Zagreb"
  | "Europe/Zurich"
  | "GMT"
  | "Indian/Antananarivo"
  | "Indian/Chagos"
  | "Indian/Christmas"
  | "Indian/Cocos"
  | "Indian/Comoro"
  | "Indian/Kerguelen"
  | "Indian/Mahe"
  | "Indian/Maldives"
  | "Indian/Mauritius"
  | "Indian/Mayotte"
  | "Indian/Reunion"
  | "Pacific/Apia"
  | "Pacific/Auckland"
  | "Pacific/Bougainville"
  | "Pacific/Chatham"
  | "Pacific/Chuuk"
  | "Pacific/Easter"
  | "Pacific/Efate"
  | "Pacific/Fakaofo"
  | "Pacific/Fiji"
  | "Pacific/Funafuti"
  | "Pacific/Galapagos"
  | "Pacific/Gambier"
  | "Pacific/Guadalcanal"
  | "Pacific/Guam"
  | "Pacific/Honolulu"
  | "Pacific/Kanton"
  | "Pacific/Kiritimati"
  | "Pacific/Kosrae"
  | "Pacific/Kwajalein"
  | "Pacific/Majuro"
  | "Pacific/Marquesas"
  | "Pacific/Midway"
  | "Pacific/Nauru"
  | "Pacific/Niue"
  | "Pacific/Norfolk"
  | "Pacific/Noumea"
  | "Pacific/Pago_Pago"
  | "Pacific/Palau"
  | "Pacific/Pitcairn"
  | "Pacific/Pohnpei"
  | "Pacific/Port_Moresby"
  | "Pacific/Rarotonga"
  | "Pacific/Saipan"
  | "Pacific/Tahiti"
  | "Pacific/Tarawa"
  | "Pacific/Tongatapu"
  | "Pacific/Wake"
  | "Pacific/Wallis"
  | "US/Alaska"
  | "US/Arizona"
  | "US/Central"
  | "US/Eastern"
  | "US/Hawaii"
  | "US/Mountain"
  | "US/Pacific"
  | "UTC";

export interface TransferCycleIssueRequestRequest {
  new_cycle_id: string; // ID of the target cycle to transfer issues to
}

export type TypeEnum =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/jpg"
  | "image/gif";

export interface UserAssetUploadRequest {
  name: string; // Original filename of the asset
  type?: TypeEnum; // MIME type of the file `image/jpeg` - JPEG `image/png` - PNG `image/webp` - WebP `image/jpg` - JPG `image/gif` - GIF
  size: number; // File size in bytes
  entity_type: EntityTypeEnum; // Type of user asset `USER_AVATAR` - User Avatar `USER_COVER` - User Cover
}

export interface UserLite {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  avatar_url?: string; // Avatar URL
  display_name?: string;
}
