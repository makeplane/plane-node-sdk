import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { Epic } from "../../models/Epic";
import { PaginatedResponse } from "../../models/common";
import { AddInitiativeEpicsRequest, RemoveInitiativeEpicsRequest } from "../../models/Initiative";

/**
 * Initiative Epics API resource
 * Handles initiative epic relationships
 */
export class Epics extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Get epics associated with an initiative
   */
  async list(workspaceSlug: string, initiativeId: string, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<Epic>> {
    return this.get<PaginatedResponse<Epic>>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/epics/`, params);
  }

  /**
   * Add epics to an initiative
   */
  async add(workspaceSlug: string, initiativeId: string, addEpics: AddInitiativeEpicsRequest): Promise<Epic[]> {
    return this.post<Epic[]>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/epics/`, addEpics);
  }

  /**
   * Remove epics from an initiative
   */
  async remove(workspaceSlug: string, initiativeId: string, removeEpics: RemoveInitiativeEpicsRequest): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/epics/`, removeEpics);
  }
}

