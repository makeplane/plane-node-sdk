/** `INTERNAL` | `EXTERNAL` — the golden's `WorkItemCommentAccessEnum`. */
export type WorkItemCommentAccess = "INTERNAL" | "EXTERNAL";

/** A comment on a work item. Every field except `id` is optional — see {@link WorkItem}. */
export interface WorkItemComment {
  id: string;
  access?: WorkItemCommentAccess;
  actor_id?: string | null;
  comment_html?: string;
  comment_stripped?: string;
  created_at?: string;
  created_by_id?: string | null;
  edited_at?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  work_item_id?: string;
}

/** POST body. `comment_html` is required by the API. */
export interface CreateWorkItemComment {
  comment_html: string;
  access?: WorkItemCommentAccess;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. */
export type UpdateWorkItemComment = Partial<CreateWorkItemComment>;
