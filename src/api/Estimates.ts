import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import {
  Estimate,
  CreateEstimateRequest,
  UpdateEstimateRequest,
  EstimatePoint,
  CreateEstimatePointRequest,
  UpdateEstimatePointRequest,
} from "../models/Estimate";
import { Project } from "../models/Project";

/**
 * Estimates API resource
 * Manages project estimates and estimate points
 */
export class Estimates extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  // ===== ESTIMATE CRUD =====

  /**
   * Create a new estimate for a project
   */
  async create(workspaceSlug: string, projectId: string, createEstimate: CreateEstimateRequest): Promise<Estimate> {
    return this.post<Estimate>(`/workspaces/${workspaceSlug}/projects/${projectId}/estimates/`, createEstimate);
  }

  /**
   * Retrieve the estimate configured for a project
   */
  async retrieve(workspaceSlug: string, projectId: string): Promise<Estimate> {
    return this.get<Estimate>(`/workspaces/${workspaceSlug}/projects/${projectId}/estimates/`);
  }

  /**
   * Update the estimate for a project
   */
  async update(workspaceSlug: string, projectId: string, updateEstimate: UpdateEstimateRequest): Promise<Estimate> {
    return this.patch<Estimate>(`/workspaces/${workspaceSlug}/projects/${projectId}/estimates/`, updateEstimate);
  }

  /**
   * Delete the estimate for a project
   */
  async delete(workspaceSlug: string, projectId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/estimates/`);
  }

  /**
   * Link an estimate to a project so it becomes the active estimate system.
   * Delegates to the project update endpoint (PATCH .../projects/{projectId}).
   */
  async linkToProject(workspaceSlug: string, projectId: string, estimateId: string): Promise<Project> {
    return this.patch<Project>(`/workspaces/${workspaceSlug}/projects/${projectId}/`, { estimate: estimateId });
  }

  // ===== ESTIMATE POINTS =====

  /**
   * List all estimate points for a project estimate
   */
  async listPoints(workspaceSlug: string, projectId: string, estimateId: string): Promise<EstimatePoint[]> {
    return this.get<EstimatePoint[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/estimates/${estimateId}/estimate-points/`
    );
  }

  /**
   * Create estimate points for a project estimate.
   * The API accepts a JSON array directly as the request body.
   */
  async createPoints(
    workspaceSlug: string,
    projectId: string,
    estimateId: string,
    points: CreateEstimatePointRequest[]
  ): Promise<EstimatePoint[]> {
    return this.post<EstimatePoint[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/estimates/${estimateId}/estimate-points/`,
      points
    );
  }

  /**
   * Update a single estimate point
   */
  async updatePoint(
    workspaceSlug: string,
    projectId: string,
    estimateId: string,
    estimatePointId: string,
    updatePoint: UpdateEstimatePointRequest
  ): Promise<EstimatePoint> {
    return this.patch<EstimatePoint>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/estimates/${estimateId}/estimate-points/${estimatePointId}/`,
      updatePoint
    );
  }

  /**
   * Delete a single estimate point
   */
  async deletePoint(
    workspaceSlug: string,
    projectId: string,
    estimateId: string,
    estimatePointId: string
  ): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/estimates/${estimateId}/estimate-points/${estimatePointId}/`
    );
  }
}
