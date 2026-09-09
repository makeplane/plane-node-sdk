/** A link attached to a work item. Every field except `id` is optional — see {@link WorkItem}. */
export interface WorkItemLink {
  id: string;
  created_at?: string;
  created_by_id?: string | null;
  metadata?: unknown;
  title?: string | null;
  url?: string;
  work_item_id?: string;
}

/** POST body. `url` is required by the API. */
export interface CreateWorkItemLink {
  url: string;
  title?: string | null;
  metadata?: unknown;
}

/** PATCH body — every field optional. */
export type UpdateWorkItemLink = Partial<CreateWorkItemLink>;
