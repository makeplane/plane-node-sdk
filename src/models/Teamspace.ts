import { BaseModel, LogoProps } from "./common";

/**
 * Teamspace model interfaces
 */
export interface Teamspace extends BaseModel {
  name: string;
  description_json?: Record<string, any>;
  description_html?: string;
  description_stripped?: string;
  description_binary?: string;
  logo_props?: LogoProps;
  lead?: string;
  workspace: string;
}

export type CreateTeamspace = Omit<
  Teamspace,
  "id" | "created_at" | "updated_at" | "deleted_at" | "created_by" | "updated_by" | "workspace"
>;

export type UpdateTeamspace = Partial<CreateTeamspace>;

export interface ListTeamspacesParams {
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface AddTeamspaceProjectsRequest {
  project_ids: string[];
}

export interface RemoveTeamspaceProjectsRequest {
  project_ids: string[];
}

export interface AddTeamspaceMembersRequest {
  member_ids: string[];
}

export interface RemoveTeamspaceMembersRequest {
  member_ids: string[];
}
