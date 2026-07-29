import { BaseModel, LogoProps } from "./common";

export enum InitiativeState {
  DRAFT = "DRAFT",
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
}
/**
 * Initiative model interfaces
 */
export interface Initiative extends BaseModel {
  name: string;
  description?: string;
  description_html?: string;
  description_stripped?: string;
  description_binary?: string;
  lead?: string;
  start_date?: string;
  end_date?: string;
  logo_props?: LogoProps;
  state?: InitiativeState;
  workspace: string;
}

export type CreateInitiative = Omit<
  Initiative,
  "id" | "created_at" | "updated_at" | "deleted_at" | "created_by" | "updated_by" | "workspace"
>;

export type UpdateInitiative = Partial<CreateInitiative>;

export interface ListInitiativesParams {
  /** Page size. Maps to the API's `per_page` query param. */
  per_page?: number;
  /** Pagination position. Use `next_cursor` from the previous response. */
  cursor?: string;
  [key: string]: any;
}

export interface AddInitiativeLabelsRequest {
  label_ids: string[];
}

export interface RemoveInitiativeLabelsRequest {
  label_ids: string[];
}

export interface AddInitiativeProjectsRequest {
  project_ids: string[];
}

export interface RemoveInitiativeProjectsRequest {
  project_ids: string[];
}

export interface AddInitiativeEpicsRequest {
  epic_ids: string[];
}

export interface RemoveInitiativeEpicsRequest {
  epic_ids: string[];
}
