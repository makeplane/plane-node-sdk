/** The golden's `IntakeWorkItemPriorityEnum`. */
export type IntakeWorkItemPriority = "none" | "low" | "medium" | "high" | "urgent";

/** The golden's `IntakeWorkItemStatusEnum` — `-2` Pending, `-1` Rejected, `0` Snoozed, `1` Accepted, `2` Duplicate. */
export type IntakeWorkItemStatus = -2 | -1 | 0 | 1 | 2;

/** An item submitted to a project's intake (triage queue). Golden's schema name is `IntakeIssue`, renamed per "never issue". */
export interface IntakeWorkItem {
  id: string;
  name?: string;
  description_html?: string;
  priority?: IntakeWorkItemPriority;
  status?: IntakeWorkItemStatus;
  snoozed_till?: string | null;
  source?: string | null;
  source_email?: string | null;
  /** Set when `status` is `2` (Duplicate) — the work item this one duplicates. */
  duplicate_to_id?: string | null;
  state_id?: string | null;
  intake_id?: string;
  /** The work item created for this intake row. */
  work_item_id?: string;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** Create/update body — one shape for both. `name` required to create; PATCH also folds v1's triage-status endpoint. */
export interface CreateIntakeWorkItem {
  name: string;
  description_html?: string;
  priority?: IntakeWorkItemPriority;
  status?: IntakeWorkItemStatus;
  snoozed_till?: string | null;
  source?: string;
  source_email?: string | null;
  duplicate_to_id?: string | null;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional (including `name`). v2 has no PUT. */
export type UpdateIntakeWorkItem = Partial<CreateIntakeWorkItem>;
