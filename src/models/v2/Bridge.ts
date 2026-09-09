/**
 * Internal wire shapes behind `V2Resource.doBridge` — the one `{add}`/`{remove}` -> `{added}`/`{removed}` contract every
 * membership bridge (cycle/module/milestone/customer/release/initiative work items, initiative projects, release/initiative
 * labels, collection members/pages) shares. Not exported from the package: callers see `add(...)`/`remove(...)` -> `string[]`.
 */
export interface BridgeRequest<TItem = string> {
  add?: TItem[];
  remove?: TItem[];
}

/** The ids the server actually changed — idempotent no-ops and unknown/out-of-scope ids are omitted. */
export interface BridgeResponse {
  added?: string[];
  removed?: string[];
}
