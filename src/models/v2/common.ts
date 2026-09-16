import { FieldError } from "../../errors/PlaneApiError";

/** Default list envelope. `total_count` is absent when the caller sent ?count=false. */
export interface OffsetPage<T> {
  data: T[];
  pagination: { style: "offset" };
  next?: number | null;
  previous?: number | null;
  total_count?: number | null;
}

/** Keyset envelope, returned when the caller sent ?paginate=cursor. */
export interface CursorPage<T> {
  data: T[];
  pagination: { style: "cursor" };
  has_more?: boolean;
  next_cursor?: string | null;
}

export type Page<T> = OffsetPage<T> | CursorPage<T>;

/** A row that landed. `result` says which write happened. */
export interface BulkRowSuccess {
  index: number;
  result: "created" | "updated" | "deleted";
  id: string;
}

/** A row that did not land, carrying its own problem detail. */
export interface BulkRowFailure {
  index: number;
  result: "failed";
  type: string;
  code: string;
  detail: string;
  errors?: FieldError[];
  id?: string;
}

export type BulkWriteRow = BulkRowSuccess | BulkRowFailure;

/** Always HTTP 200 — read `results` for what happened. `all_or_none: true` turns any failure into a 409 raised as PlaneApiError. */
export interface BulkWriteResponse {
  results: BulkWriteRow[];
  succeeded: number;
  failed: number;
}

/** One row of a bulk update: the target id plus the fields to change. */
export type BulkUpdateItem<TPatch> = TPatch & { id: string };
