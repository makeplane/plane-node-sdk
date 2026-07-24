import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { PaginatedResponse } from "../../models/common";
import {
  AddCollectionPages,
  CollectionBranchPage,
  CollectionPage,
  CollectionPageSearchResult,
  ListCollectionPagesParams,
  UpdateCollectionPage,
} from "../../models/Collection";

/**
 * CollectionPages sub-resource
 * Manages the pages that belong to a collection
 */
export class Pages extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List pages that belong to a collection.
   * Without `parent_id`, returns only top-level (non-sub) pages.
   */
  async list(
    workspaceSlug: string,
    collectionId: string,
    params?: ListCollectionPagesParams
  ): Promise<PaginatedResponse<CollectionBranchPage>> {
    return this.get<PaginatedResponse<CollectionBranchPage>>(
      `/workspaces/${workspaceSlug}/collections/${collectionId}/pages/`,
      params
    );
  }

  /**
   * Add existing page(s) to a collection
   */
  async add(workspaceSlug: string, collectionId: string, pagesData: AddCollectionPages): Promise<CollectionPage[]> {
    const result = await this.post<CollectionPage[] | { results: CollectionPage[] }>(
      `/workspaces/${workspaceSlug}/collections/${collectionId}/pages/`,
      pagesData
    );
    return Array.isArray(result) ? result : result.results;
  }

  /**
   * Search pages that are not yet in a collection, to add them.
   *
   * @param search - Optional case-insensitive substring filter on page name
   */
  async search(workspaceSlug: string, collectionId: string, search?: string): Promise<CollectionPageSearchResult[]> {
    const data = await this.get<CollectionPageSearchResult[] | { results: CollectionPageSearchResult[] }>(
      `/workspaces/${workspaceSlug}/collections/${collectionId}/pages-search/`,
      search ? { search } : undefined
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Move a page to a different collection, or reorder it within the current one.
   * Omit `collection` in the payload to just reorder.
   *
   * @param pageCollectionId - UUID of the page-collection membership row
   */
  async update(
    workspaceSlug: string,
    collectionId: string,
    pageCollectionId: string,
    updateData: UpdateCollectionPage
  ): Promise<CollectionPage> {
    return this.patch<CollectionPage>(
      `/workspaces/${workspaceSlug}/collections/${collectionId}/pages/${pageCollectionId}/`,
      updateData
    );
  }

  /**
   * Remove a page from a collection (does not delete the page itself).
   *
   * @param pageCollectionId - UUID of the page-collection membership row
   */
  async remove(workspaceSlug: string, collectionId: string, pageCollectionId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/collections/${collectionId}/pages/${pageCollectionId}/`);
  }
}
