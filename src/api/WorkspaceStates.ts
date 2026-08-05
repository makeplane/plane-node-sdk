import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { PaginatedResponse } from "../models/common";
import { CreateWorkspaceState, ListWorkspaceStatesParams, State, UpdateWorkspaceState } from "../models/State";

/**
 * WorkspaceStates API resource
 * Manages workspace-level work-item states.
 *
 * Reads are dual-mode: under workspace governance, `list`/`retrieve` serve
 * the workspace states catalog; in ungoverned workspaces they aggregate the
 * states of every project the caller can access. Writes are only available
 * when the workspace owns states and workflows — otherwise the API responds
 * 400 with code `workspace_not_managed`. Check
 * `Workspace.retrieveFeatures(...).states_owned_by_workspace` to know which
 * mode a workspace is in.
 *
 * Not to be confused with `WorkspaceProjectStates` (`{slug}/project-states/`),
 * which manages project *lifecycle* states.
 */
export class WorkspaceStates extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List states at workspace scope (works in both modes)
   */
  async list(workspaceSlug: string, params?: ListWorkspaceStatesParams): Promise<PaginatedResponse<State>> {
    return this.get<PaginatedResponse<State>>(`/workspaces/${workspaceSlug}/states/`, params);
  }

  /**
   * Retrieve a workspace state by its external ID and source
   */
  async retrieveByExternalId(workspaceSlug: string, externalId: string, externalSource: string): Promise<State> {
    return this.get<State>(`/workspaces/${workspaceSlug}/states/`, {
      external_id: externalId,
      external_source: externalSource,
    });
  }

  /**
   * Create a new workspace (catalog) state.
   * Governed workspaces only (400 `workspace_not_managed` otherwise).
   * Catalog state names are workspace-unique — a duplicate name responds 409
   * with code `state_name_in_use`.
   */
  async create(workspaceSlug: string, data: CreateWorkspaceState): Promise<State> {
    return this.post<State>(`/workspaces/${workspaceSlug}/states/`, data);
  }

  /**
   * Retrieve a workspace state by ID
   */
  async retrieve(workspaceSlug: string, stateId: string): Promise<State> {
    return this.get<State>(`/workspaces/${workspaceSlug}/states/${stateId}/`);
  }

  /**
   * Update a workspace (catalog) state by ID.
   * Governed workspaces only. The triage state cannot be updated, and the
   * `default` flag is managed by the workflow's default state.
   */
  async update(workspaceSlug: string, stateId: string, data: UpdateWorkspaceState): Promise<State> {
    return this.patch<State>(`/workspaces/${workspaceSlug}/states/${stateId}/`, data);
  }

  /**
   * Delete a workspace (catalog) state by ID.
   * Governed workspaces only. Deletion is blocked (400) while any workflow
   * chain references the state or any work item still points at it; the
   * triage state is never deletable.
   */
  async delete(workspaceSlug: string, stateId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/states/${stateId}/`);
  }
}
