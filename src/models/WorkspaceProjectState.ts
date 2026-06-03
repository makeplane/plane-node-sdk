import { BaseModel } from "./common";

/**
 * Workspace project state model interfaces
 */
export interface WorkspaceProjectState extends BaseModel {
  name: string;
  color?: string;
  group?: string;
  sequence?: number;
  default?: boolean;
  description?: string;
  workspace: string;
}

export type CreateWorkspaceProjectState = Pick<
  WorkspaceProjectState,
  "name" | "color" | "group" | "sequence" | "default" | "description"
>;

export type UpdateWorkspaceProjectState = Partial<CreateWorkspaceProjectState>;
