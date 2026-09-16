/** A logged-time entry on a work item. Every field except `id` is optional — see {@link WorkItem}. */
export interface WorkItemWorklog {
  id: string;
  created_at?: string;
  created_by_id?: string | null;
  description?: string;
  /** Minutes logged. */
  duration?: number;
  logged_by_id?: string | null;
  updated_at?: string;
  work_item_id?: string;
}

/** POST body. `duration` is required by the API. */
export interface CreateWorkItemWorklog {
  duration: number;
  description?: string;
}

/** PATCH body — every field optional. */
export type UpdateWorkItemWorklog = Partial<CreateWorkItemWorklog>;
