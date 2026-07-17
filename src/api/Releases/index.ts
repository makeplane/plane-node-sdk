import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { Release, CreateRelease, UpdateRelease, ListReleasesParams } from "../../models/Release";
import { PaginatedResponse } from "../../models/common";
import { Labels } from "./Labels";
import { Tags } from "./Tags";
import { WorkItems } from "./WorkItems";
import { Comments } from "./Comments";
import { Links } from "./Links";

/**
 * Releases API resource
 * Handles all release-related operations. Releases are workspace-scoped.
 */
export class Releases extends BaseResource {
  public labels: Labels;
  public tags: Tags;
  public workItems: WorkItems;
  public comments: Comments;
  public links: Links;

  constructor(config: Configuration) {
    super(config);
    this.labels = new Labels(config);
    this.tags = new Tags(config);
    this.workItems = new WorkItems(config);
    this.comments = new Comments(config);
    this.links = new Links(config);
  }

  /**
   * Create a new release
   */
  async create(workspaceSlug: string, createRelease: CreateRelease): Promise<Release> {
    return this.post<Release>(`/workspaces/${workspaceSlug}/releases/`, createRelease);
  }

  /**
   * Retrieve a release by ID
   */
  async retrieve(workspaceSlug: string, releaseId: string): Promise<Release> {
    return this.get<Release>(`/workspaces/${workspaceSlug}/releases/${releaseId}/`);
  }

  /**
   * Update a release
   */
  async update(workspaceSlug: string, releaseId: string, updateRelease: UpdateRelease): Promise<Release> {
    return this.patch<Release>(`/workspaces/${workspaceSlug}/releases/${releaseId}/`, updateRelease);
  }

  /**
   * Delete a release
   */
  async delete(workspaceSlug: string, releaseId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/`);
  }

  /**
   * List releases with optional filtering
   */
  async list(workspaceSlug: string, params?: ListReleasesParams): Promise<PaginatedResponse<Release>> {
    return this.get<PaginatedResponse<Release>>(`/workspaces/${workspaceSlug}/releases/`, params);
  }
}
