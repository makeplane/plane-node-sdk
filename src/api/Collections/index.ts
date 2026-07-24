import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { Collection, CreateCollection, UpdateCollection } from "../../models/Collection";
import { Members } from "./Members";
import { Pages } from "./Pages";

/**
 * Collections API resource
 * Manages collections (folders that group workspace pages) with member and
 * page sub-resources
 */
export class Collections extends BaseResource {
  public members: Members;
  public pages: Pages;

  constructor(config: Configuration) {
    super(config);
    this.members = new Members(config);
    this.pages = new Pages(config);
  }

  /**
   * List all collections in a workspace
   */
  async list(workspaceSlug: string): Promise<Collection[]> {
    const data = await this.get<Collection[] | { results: Collection[] }>(`/workspaces/${workspaceSlug}/collections/`);
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Create a new collection in a workspace
   */
  async create(workspaceSlug: string, createCollection: CreateCollection): Promise<Collection> {
    return this.post<Collection>(`/workspaces/${workspaceSlug}/collections/`, createCollection);
  }

  /**
   * Retrieve a collection by ID
   */
  async retrieve(workspaceSlug: string, collectionId: string): Promise<Collection> {
    return this.get<Collection>(`/workspaces/${workspaceSlug}/collections/${collectionId}/`);
  }

  /**
   * Update a collection's name, logo, or sort order.
   * A collection's access level cannot be changed after creation.
   */
  async update(workspaceSlug: string, collectionId: string, updateCollection: UpdateCollection): Promise<Collection> {
    return this.patch<Collection>(`/workspaces/${workspaceSlug}/collections/${collectionId}/`, updateCollection);
  }

  /**
   * Delete a collection.
   *
   * @param archivePages - Whether to archive the collection's pages instead of
   * leaving them unfiled. Omit to use the server's default (true). Private
   * collections always archive their pages regardless.
   */
  async delete(workspaceSlug: string, collectionId: string, archivePages?: boolean): Promise<void> {
    const params = archivePages === undefined ? undefined : { archive_pages: archivePages ? "true" : "false" };
    return this.httpDelete(`/workspaces/${workspaceSlug}/collections/${collectionId}/`, undefined, params);
  }
}
