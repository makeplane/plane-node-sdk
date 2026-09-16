/** `none` | `low` | `medium` | `high` | `urgent` — the golden's `PriorityEnum`. */
export type WorkItemPriority = "none" | "low" | "medium" | "high" | "urgent";

/** One custom property value on a work item, present only on single-object responses. */
export interface WorkItemCustomFieldValue {
  /** Property definition id. */
  id: string;
  /** Human-readable value; a list when the property is multi-valued. */
  value: unknown;
  /** Rich object(s) for OPTION/RELATION properties; `null` otherwise. */
  value_detail: unknown;
}

/** A work item — golden's `issue_*` field names are upstream pass-through, never renamed. `?expand=` replaces `*_id` fields with objects. */
export interface WorkItem {
  id: string;
  /** Non-null only once the work item has been archived. */
  archived_at?: string | null;
  assignee_ids?: string[];
  created_at?: string;
  created_by_id?: string | null;
  /** Keyed by property name; properties with no value are omitted. */
  custom_fields?: Record<string, WorkItemCustomFieldValue> | null;
  /** The work item's single cycle, or null — a work item belongs to at most one. */
  cycle_id?: string | null;
  /** The composite human key `PROJ-123` (project identifier + per-project sequence). */
  identifier?: string | null;
  is_draft?: boolean;
  label_ids?: string[];
  /** Every module the work item belongs to — unlike cycles, a work item can be in many. */
  module_ids?: string[];
  name?: string;
  parent_id?: string | null;
  priority?: WorkItemPriority;
  project_id?: string;
  sequence_id?: number;
  start_date?: string | null;
  state_id?: string;
  target_date?: string | null;
  type_id?: string | null;
}

/** Create or update a work item. Six fields pair a human value with an id (`state`/`type`/`parent`/`estimate`/`assignees`/`labels`) — send one, never both. */
export interface CreateWorkItem {
  name: string;
  assignee_ids?: string[];
  /** Readable form of {@link CreateWorkItem.assignee_ids} — member emails. */
  assignees?: string[];
  /** Keyed by property id or name; `null` is accepted and changes nothing. */
  custom_fields?: Record<string, unknown> | null;
  cycle_id?: string | null;
  description_html?: string | null;
  /** Readable form of {@link CreateWorkItem.estimate_point_id}. */
  estimate?: string | null;
  estimate_point_id?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  label_ids?: string[];
  /** Readable form of {@link CreateWorkItem.label_ids} — label names. */
  labels?: string[];
  module_ids?: string[];
  /** Readable form of {@link CreateWorkItem.parent_id} — the parent's identifier or id. */
  parent?: string | null;
  parent_id?: string | null;
  priority?: WorkItemPriority;
  start_date?: string | null;
  /** Readable form of {@link CreateWorkItem.state_id} — the state's name. */
  state?: string | null;
  state_id?: string | null;
  /** Must not be earlier than `start_date`. */
  target_date?: string | null;
  /** Readable form of {@link CreateWorkItem.type_id} — the work item type's name. */
  type?: string | null;
  type_id?: string | null;
}

/** PATCH body — every field optional, including `name`. v2 has no PUT. */
export type UpdateWorkItem = Partial<CreateWorkItem>;
