import { BaseModel } from "./common";

export interface WorkLog extends BaseModel {
  description: string;
  // duration in minutes
  duration: number;
  project_id: string;
  workspace_id: string;
  logged_by: string;
}

/**
 * Create work log request
 *
 * @param description - The description of the work log
 * @param duration - The duration of the work log in minutes
 */
export interface CreateWorkLogRequest {
  description?: string;
  // duration in minutes
  duration: number;
}

export interface UpdateWorkLogRequest {
  description?: string;
  // duration in minutes
  duration?: number;
}
