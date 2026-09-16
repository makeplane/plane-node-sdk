/** Body for `POST .../cycles/{id}/transfer/` — moves the completed source cycle's incomplete work items into `new_cycle_id`. */
export interface CycleTransferRequest {
  new_cycle_id: string;
}

/** The golden documents the response with the same shape as the request (echoes the target cycle id back). */
export type CycleTransferResult = CycleTransferRequest;
