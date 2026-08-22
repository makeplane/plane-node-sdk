/** POST body for `.../milestones/{id}/work-items/`: work item ids to attach/detach in one call. */
export interface MilestoneWorkItemManageRequest {
  add?: string[];
  remove?: string[];
}

/** The work item ids actually added/removed — idempotent no-ops are omitted. */
export interface MilestoneWorkItemManageResponse {
  added: string[];
  removed: string[];
}
