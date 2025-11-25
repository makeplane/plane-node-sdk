import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { InitiativeLabel, CreateInitiativeLabel, UpdateInitiativeLabel, ListInitiativeLabelsParams } from "../../models/InitiativeLabel";
import { PaginatedResponse } from "../../models/common";
import { AddInitiativeLabelsRequest, RemoveInitiativeLabelsRequest } from "../../models/Initiative";

/**
 * Initiative Labels API resource
 * Handles initiative label relationships
 */
export class Labels extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new initiative label
   */
  async create(workspaceSlug: string, createInitiativeLabel: CreateInitiativeLabel): Promise<InitiativeLabel> {
    return this.post<InitiativeLabel>(`/workspaces/${workspaceSlug}/initiatives/labels/`, createInitiativeLabel);
  }

  /**
   * Retrieve an initiative label by ID
   */
  async retrieve(workspaceSlug: string, initiativeLabelId: string): Promise<InitiativeLabel> {
    return this.get<InitiativeLabel>(`/workspaces/${workspaceSlug}/initiatives/labels/${initiativeLabelId}/`);
  }

  /**
   * Update an initiative label
   */
  async update(workspaceSlug: string, initiativeLabelId: string, updateInitiativeLabel: UpdateInitiativeLabel): Promise<InitiativeLabel> {
    return this.patch<InitiativeLabel>(`/workspaces/${workspaceSlug}/initiatives/labels/${initiativeLabelId}/`, updateInitiativeLabel);
  }

  /**
   * Delete an initiative label
   */
  async delete(workspaceSlug: string, initiativeLabelId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/initiatives/labels/${initiativeLabelId}/`);
  }

  /**
   * List initiative labels with optional filtering
   */
  async list(workspaceSlug: string, params?: ListInitiativeLabelsParams): Promise<PaginatedResponse<InitiativeLabel>> {
    return this.get<PaginatedResponse<InitiativeLabel>>(`/workspaces/${workspaceSlug}/initiatives/labels/`, params);
  }

  /**
   * Add labels to an initiative
   */
  async addLabels(workspaceSlug: string, initiativeId: string, addLabels: AddInitiativeLabelsRequest): Promise<InitiativeLabel[]> {
    return this.post<InitiativeLabel[]>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/labels/`, addLabels);
  }

  /**
   * Remove labels from an initiative
   */
  async removeLabels(workspaceSlug: string, initiativeId: string, removeLabels: RemoveInitiativeLabelsRequest): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/labels/`, removeLabels);
  }

  /**
   * Get labels associated with an initiative
   */
  async listLabels(workspaceSlug: string, initiativeId: string, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<InitiativeLabel>> {
    return this.get<PaginatedResponse<InitiativeLabel>>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/labels/`, params);
  }

}

