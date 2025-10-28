import { BaseModel, LogoProps } from "./common";

/**
 * WorkItemType model interfaces
 */
export interface WorkItemType extends BaseModel {
  name: string;
  description?: string;
  logo_props: LogoProps;
  is_epic: boolean;
  is_default: boolean;
  is_active: boolean;
  level: number;
  workspace: string;
  project: string;
}

export type CreateWorkItemType = Partial<WorkItemType>;

export type UpdateWorkItemType = Partial<WorkItemType>;
