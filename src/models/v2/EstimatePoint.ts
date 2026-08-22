/** One value on an {@link Estimate}'s scale (e.g. "XS", "3", "1 day"), nested under `estimates.points`. */
export interface EstimatePoint {
  id: string;
  /** The parent estimate's id — present on every row regardless of which nested path it was read through. */
  estimate_id?: string;
  /** Sort position within the scale (0-based). */
  key?: number;
  value?: string;
  description?: string;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `value` is required by the API. */
export interface CreateEstimatePoint {
  value: string;
  key?: number;
  description?: string;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateEstimatePoint = Partial<CreateEstimatePoint>;
