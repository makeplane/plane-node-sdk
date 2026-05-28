import { BaseModel } from "./common";

/**
 * Work item relation definition model interfaces
 */
export interface WorkItemRelationDefinition extends BaseModel {
  name: string;
  outward?: string;
  inward?: string;
  is_default?: boolean;
  is_active?: boolean;
  color?: string;
  sort_order?: number;
  workspace: string;
}

export type CreateWorkItemRelationDefinition = Pick<
  WorkItemRelationDefinition,
  "name" | "outward" | "inward" | "is_default" | "is_active" | "color" | "sort_order"
>;

export type UpdateWorkItemRelationDefinition = Partial<CreateWorkItemRelationDefinition>;

export interface ListWorkItemRelationDefinitionsParams {
  is_default?: boolean;
  is_active?: boolean;
}
