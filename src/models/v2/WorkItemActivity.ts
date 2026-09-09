/** An audit-log entry for a change to a work item. Read-only. `issue_comment_id` is the golden's field name, kept as-is. */
export interface WorkItemActivity {
  id: string;
  actor_id?: string | null;
  comment?: string;
  created_at?: string;
  /** Present only on a worklog-shaped activity row. */
  duration?: number | null;
  epoch?: number | null;
  external_id?: string | null;
  external_source?: string | null;
  field?: string | null;
  issue_comment_id?: string | null;
  new_identifier_id?: string | null;
  new_value?: string | null;
  old_identifier_id?: string | null;
  old_value?: string | null;
  verb?: string;
  work_item_id?: string | null;
}
