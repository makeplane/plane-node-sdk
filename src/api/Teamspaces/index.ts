import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { Teamspace, CreateTeamspace, UpdateTeamspace, ListTeamspacesParams } from "../../models/Teamspace";
import { PaginatedResponse } from "../../models/common";
import { Projects } from "./Projects";
import { Members } from "./Members";

/**
 * Teamspaces API resource
 * Handles all teamspace-related operations
 */
export class Teamspaces extends BaseResource {
  public projects: Projects;
  public members: Members;

  constructor(config: Configuration) {
    super(config);
    this.projects = new Projects(config);
    this.members = new Members(config);
  }

  /**
   * Create a new teamspace
   */
  async create(workspaceSlug: string, createTeamspace: CreateTeamspace): Promise<Teamspace> {
    return this.post<Teamspace>(`/workspaces/${workspaceSlug}/teamspaces/`, createTeamspace);
  }

  /**
   * Retrieve a teamspace by ID
   */
  async retrieve(workspaceSlug: string, teamspaceId: string): Promise<Teamspace> {
    return this.get<Teamspace>(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/`);
  }

  /**
   * Update a teamspace
   */
  async update(workspaceSlug: string, teamspaceId: string, updateTeamspace: UpdateTeamspace): Promise<Teamspace> {
    return this.patch<Teamspace>(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/`, updateTeamspace);
  }

  /**
   * Delete a teamspace
   */
  async delete(workspaceSlug: string, teamspaceId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/teamspaces/${teamspaceId}/`);
  }

  /**
   * List teamspaces with optional filtering
   */
  async list(workspaceSlug: string, params?: ListTeamspacesParams): Promise<PaginatedResponse<Teamspace>> {
    return this.get<PaginatedResponse<Teamspace>>(`/workspaces/${workspaceSlug}/teamspaces/`, params);
  }
}

