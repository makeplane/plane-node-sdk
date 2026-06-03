import { BaseModel } from "./common";

/**
 * Workspace project label model interfaces
 */
export interface WorkspaceProjectLabel extends BaseModel {
  name: string;
  color?: string;
  sort_order?: number;
  workspace: string;
}

export type CreateWorkspaceProjectLabel = Pick<WorkspaceProjectLabel, "name" | "color" | "sort_order">;

export type UpdateWorkspaceProjectLabel = Partial<CreateWorkspaceProjectLabel>;
