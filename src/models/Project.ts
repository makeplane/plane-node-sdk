import { BaseModel } from "./common";

/**
 * Project model interfaces
 */
export interface Project extends BaseModel {
  id: string;
  total_members: number;
  total_cycles: number;
  total_modules: number;
  is_member: boolean;
  member_role: number;
  is_deployed: boolean;
  cover_image_url: null;
  name: string;
  description: string;
  network?: number;
  identifier?: string;
  emoji?: null;
  icon_prop?: null;
  module_view: boolean;
  cycle_view: boolean;
  issue_views_view: boolean;
  page_view: boolean;
  intake_view: boolean;
  is_time_tracking_enabled?: boolean;
  is_issue_type_enabled?: boolean;
  guest_view_all_features: boolean;
  cover_image?: string;
  archive_in: number;
  close_in: number;
  archived_at?: Date;
  timezone: string;
  workspace: string;
  default_assignee: null;
  project_lead: null;
  cover_image_asset: null;
  estimate: null;
  default_state: null;
}

export type CreateProject = Pick<Project, "name" | "identifier"> & Partial<Omit<Project, "name" | "identifier">>;

export type UpdateProject = Partial<Project>;

export interface ListProjectsParams {
  limit?: number;
  offset?: number;
}
