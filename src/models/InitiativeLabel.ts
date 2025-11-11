import { BaseModel } from "./common";

/**
 * InitiativeLabel model interfaces
 */
export interface InitiativeLabel extends BaseModel {
  name: string;
  description?: string;
  color?: string;
  sort_order: number;
  workspace: string;
}

export type CreateInitiativeLabel = Omit<InitiativeLabel, "id" | "created_at" | "updated_at" | "deleted_at" | "created_by" | "updated_by" | "workspace"> & {
  sort_order?: number;
};

export type UpdateInitiativeLabel = Partial<CreateInitiativeLabel>;

export interface ListInitiativeLabelsParams {
  limit?: number;
  offset?: number;
  [key: string]: any;
}

