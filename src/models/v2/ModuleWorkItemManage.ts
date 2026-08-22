/** Bulk membership body for `.../modules/{id}/work-items/` — `add`/`remove`, each capped at 100 ids. */
export interface ModuleWorkItemManageRequest {
  add?: string[];
  remove?: string[];
}

/** The work item ids actually added/removed — idempotent no-ops are omitted. */
export interface ModuleWorkItemManageResponse {
  added: string[];
  removed: string[];
}
