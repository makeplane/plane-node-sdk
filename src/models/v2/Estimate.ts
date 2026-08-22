/** The estimate system's value kind — categorical, points, or time-based. */
export type EstimateType = "categories" | "points" | "time";

/** An estimate system ({@link EstimatePoint} scale) attached to a project. A project has at most one active estimate at a time. */
export interface Estimate {
  id: string;
  name?: string;
  description?: string;
  type?: EstimateType;
  /** Whether this is the project's currently active estimate. */
  last_used?: boolean;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required by the API. */
export interface CreateEstimate {
  name: string;
  description?: string;
  type?: EstimateType;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateEstimate = Partial<CreateEstimate>;
