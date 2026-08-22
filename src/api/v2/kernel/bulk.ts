import { PlaneApiError } from "../../../errors/PlaneApiError";
import { BulkRowFailure, BulkWriteResponse, BulkWriteRow } from "../../../models/v2/common";

export function isBulkFailure(row: BulkWriteRow): row is BulkRowFailure {
  return row.result === "failed";
}

export function bulkFailures(response: BulkWriteResponse): BulkRowFailure[] {
  return response.results.filter(isBulkFailure);
}

/** Throw if any row failed. Opt-in, because partial success is the default. */
export function raiseForFailures(response: BulkWriteResponse): void {
  const failures = bulkFailures(response);
  if (failures.length === 0) return;

  const first = failures[0];
  throw new PlaneApiError({
    type: first.type,
    title: "Bulk write had failures",
    status: 200,
    code: first.code,
    detail: `${failures.length} of ${response.results.length} rows failed: ${first.detail}`,
    errors: first.errors,
  });
}
