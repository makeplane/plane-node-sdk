/** The golden's `WorkItemDependencyCreateRelationTypeEnum` — the six fixed dependency keys. */
export type WorkItemDependencyRelationType =
  | "blocked_by"
  | "blocking"
  | "start_before"
  | "start_after"
  | "finish_before"
  | "finish_after";

/** POST `.../work-items/{id}/dependencies/` body — adds a typed dependency to `work_item_ids`. */
export interface WorkItemDependencyCreateRequest {
  relation_type: WorkItemDependencyRelationType;
  work_item_ids: string[];
}

/** Typed dependencies grouped by the six fixed keys. `list` returns one grouped object, not a page of rows. */
export interface WorkItemDependencyList {
  blocked_by: string[];
  blocking: string[];
  finish_after: string[];
  finish_before: string[];
  start_after: string[];
  start_before: string[];
}
