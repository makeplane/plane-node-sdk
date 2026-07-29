/**
 * Estimate model interfaces
 * An estimate is the sizing scale configured for a project (categories, points, or time).
 */

export type EstimateType = "categories" | "points" | "time";

export interface Estimate {
  id: string;
  name: string;
  description?: string;
  type?: EstimateType;
  last_used?: boolean;
  external_id?: string;
  external_source?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
}

export interface CreateEstimateRequest {
  name: string;
  description?: string;
  type?: EstimateType;
  last_used?: boolean;
  external_id?: string;
  external_source?: string;
}

/**
 * Only name, description, external_id, and external_source are updatable.
 */
export interface UpdateEstimateRequest {
  name?: string;
  description?: string;
  external_id?: string;
  external_source?: string;
}

/**
 * An individual value within an estimate scale (e.g. "1", "2", "3" for story points).
 */
export interface EstimatePoint {
  id: string;
  estimate?: string;
  key?: number;
  value: string;
  description?: string;
  external_id?: string;
  external_source?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
}

export interface CreateEstimatePointRequest {
  /** Max length 20 characters */
  value: string;
  key?: number;
  description?: string;
  external_id?: string;
  external_source?: string;
}

export interface UpdateEstimatePointRequest {
  key?: number;
  /** Max length 20 characters */
  value?: string;
  description?: string;
  external_id?: string;
  external_source?: string;
}
