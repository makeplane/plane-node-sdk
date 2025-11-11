import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { Initiative, CreateInitiative, UpdateInitiative, ListInitiativesParams } from "../../models/Initiative";
import { PaginatedResponse } from "../../models/common";
import { Labels } from "./Labels";
import { Projects } from "./Projects";
import { Epics } from "./Epics";

/**
 * Initiatives API resource
 * Handles all initiative-related operations
 */
export class Initiatives extends BaseResource {
  public labels: Labels;
  public projects: Projects;
  public epics: Epics;

  constructor(config: Configuration) {
    super(config);
    this.labels = new Labels(config);
    this.projects = new Projects(config);
    this.epics = new Epics(config);
  }

  /**
   * Create a new initiative
   */
  async create(workspaceSlug: string, createInitiative: CreateInitiative): Promise<Initiative> {
    return this.post<Initiative>(`/workspaces/${workspaceSlug}/initiatives/`, createInitiative);
  }

  /**
   * Retrieve an initiative by ID
   */
  async retrieve(workspaceSlug: string, initiativeId: string): Promise<Initiative> {
    return this.get<Initiative>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/`);
  }

  /**
   * Update an initiative
   */
  async update(workspaceSlug: string, initiativeId: string, updateInitiative: UpdateInitiative): Promise<Initiative> {
    return this.patch<Initiative>(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/`, updateInitiative);
  }

  /**
   * Delete an initiative
   */
  async delete(workspaceSlug: string, initiativeId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/initiatives/${initiativeId}/`);
  }

  /**
   * List initiatives with optional filtering
   */
  async list(workspaceSlug: string, params?: ListInitiativesParams): Promise<PaginatedResponse<Initiative>> {
    return this.get<PaginatedResponse<Initiative>>(`/workspaces/${workspaceSlug}/initiatives/`, params);
  }
}

