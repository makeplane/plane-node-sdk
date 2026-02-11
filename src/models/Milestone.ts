import { BaseModel } from "./common";

export interface Milestone extends BaseModel {
  title: string;
  // YYYY-MM-DD format
  target_date?: string;
  project: string;
  workspace: string;
}

export interface MilestoneLite {
  id?: string;
  title: string;
  // YYYY-MM-DD format
  target_date?: string;
  external_source?: string;
  external_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMilestoneRequest {
  title: string;
  // YYYY-MM-DD format
  target_date?: string;
  external_source?: string;
  external_id?: string;
}

export interface UpdateMilestoneRequest {
  title?: string;
  // YYYY-MM-DD format
  target_date?: string;
  external_source?: string;
  external_id?: string;
}

export interface MilestoneWorkItem {
  id?: string;
  issue?: string;
  milestone?: string;
}
