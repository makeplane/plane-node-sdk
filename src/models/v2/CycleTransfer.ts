/** Body for `POST .../cycles/{id}/transfer/` — moves the completed source cycle's incomplete work items into `new_cycle_id`. */
export interface CycleTransferRequest {
  new_cycle_id: string;
}

/** The golden documents the response with the same shape as the request (echoes the target cycle id back). */
export type CycleTransferResult = CycleTransferRequest;

/** Bulk membership body for `POST .../cycles/{id}/work-items/` — `add` re-homes, `remove` takes out; each array caps at 100. */
export interface CycleWorkItemManageRequest {
  add?: string[];
  remove?: string[];
}

/** The work-item ids actually added/removed — idempotent no-ops are omitted. */
export interface CycleWorkItemManageResponse {
  added: string[];
  removed: string[];
}
