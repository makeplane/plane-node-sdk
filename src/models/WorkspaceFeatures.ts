/**
 * Workspace Features model interfaces
 *
 * All fields are optional so a caller can toggle a single feature; the update
 * endpoint is a partial (PATCH) that only applies the fields that are sent.
 */
export interface WorkspaceFeatures {
  project_grouping?: boolean;
  initiatives?: boolean;
  teams?: boolean;
  customers?: boolean;
  wiki?: boolean;
  pi?: boolean;
  work_item_types?: boolean;
  releases?: boolean;
  /**
   * Read-only: reports whether states and workflows live at the workspace
   * level (workspace governance). Only the governance migration can change
   * it — the update endpoint rejects it as an input.
   */
  states_owned_by_workspace?: boolean;
}

export type UpdateWorkspaceFeatures = Partial<Omit<WorkspaceFeatures, "states_owned_by_workspace">>;
