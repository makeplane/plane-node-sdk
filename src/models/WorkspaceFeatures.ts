/**
 * Workspace Features model interfaces
 */
export interface WorkspaceFeatures {
  project_grouping: boolean;
  initiatives: boolean;
  teams: boolean;
  customers: boolean;
  wiki: boolean;
  pi: boolean;
}

export type UpdateWorkspaceFeatures = Partial<WorkspaceFeatures>;
