import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  ReleaseLabel,
  CreateReleaseLabel,
  UpdateReleaseLabel,
  ListReleaseLabelsParams,
} from "../../models/ReleaseLabel";
import { PaginatedResponse } from "../../models/common";
import { AddReleaseLabelsRequest, RemoveReleaseLabelsRequest } from "../../models/Release";

/**
 * Release Labels API resource
 * Handles workspace-level release label CRUD and the label relationships on a release.
 */
export class Labels extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new release label
   */
  async create(workspaceSlug: string, createReleaseLabel: CreateReleaseLabel): Promise<ReleaseLabel> {
    return this.post<ReleaseLabel>(`/workspaces/${workspaceSlug}/releases/labels/`, createReleaseLabel);
  }

  /**
   * Retrieve a release label by ID
   */
  async retrieve(workspaceSlug: string, releaseLabelId: string): Promise<ReleaseLabel> {
    return this.get<ReleaseLabel>(`/workspaces/${workspaceSlug}/releases/labels/${releaseLabelId}/`);
  }

  /**
   * Update a release label
   */
  async update(
    workspaceSlug: string,
    releaseLabelId: string,
    updateReleaseLabel: UpdateReleaseLabel
  ): Promise<ReleaseLabel> {
    return this.patch<ReleaseLabel>(
      `/workspaces/${workspaceSlug}/releases/labels/${releaseLabelId}/`,
      updateReleaseLabel
    );
  }

  /**
   * Delete a release label
   */
  async delete(workspaceSlug: string, releaseLabelId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/labels/${releaseLabelId}/`);
  }

  /**
   * List release labels with optional filtering
   */
  async list(workspaceSlug: string, params?: ListReleaseLabelsParams): Promise<PaginatedResponse<ReleaseLabel>> {
    return this.get<PaginatedResponse<ReleaseLabel>>(`/workspaces/${workspaceSlug}/releases/labels/`, params);
  }

  /**
   * Add labels to a release
   */
  async addLabels(
    workspaceSlug: string,
    releaseId: string,
    addLabels: AddReleaseLabelsRequest
  ): Promise<ReleaseLabel[]> {
    return this.post<ReleaseLabel[]>(`/workspaces/${workspaceSlug}/releases/${releaseId}/labels/`, addLabels);
  }

  /**
   * Remove labels from a release
   */
  async removeLabels(
    workspaceSlug: string,
    releaseId: string,
    removeLabels: RemoveReleaseLabelsRequest
  ): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/labels/`, removeLabels);
  }

  /**
   * Get labels associated with a release
   */
  async listLabels(
    workspaceSlug: string,
    releaseId: string,
    params?: ListReleaseLabelsParams
  ): Promise<PaginatedResponse<ReleaseLabel>> {
    return this.get<PaginatedResponse<ReleaseLabel>>(
      `/workspaces/${workspaceSlug}/releases/${releaseId}/labels/`,
      params
    );
  }
}
