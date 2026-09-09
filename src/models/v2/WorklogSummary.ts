/** One work item's total logged time from `GET .../worklogs/summary/` — a bare array, both fields required. */
export interface WorklogSummaryEntry {
  work_item_id: string;
  /** Total logged minutes for this work item — same unit as {@link WorkItemWorklog.duration}. */
  duration: number;
}
