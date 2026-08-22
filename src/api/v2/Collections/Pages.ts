import {
  CollectionPageSearch,
  CollectionPagesManageRequest,
  CollectionPagesManageResponse,
} from "../../../models/v2/Collection";
import { FIELDS } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type CollectionPageSearchField = (typeof FIELDS)["collections_pages_search"][number];

const PAGES_SEARCH_PATH = "/workspaces/{slug}/collections/{pk}/pages-search/";

/** Bulk page membership of a collection, at `...wiki.collections.pages` — `{add, remove}` id arrays, plus `search`. */
export class CollectionPages extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/collections/{pk}/pages/";
  protected operations: Record<string, AnyOperationId> = {
    search: "collections_pages_search",
    manage: "collections_pages",
  };

  /** Attach/detach pages by id. */
  async manage(collectionId: string, data: CollectionPagesManageRequest): Promise<CollectionPagesManageResponse> {
    return this.transport.request<CollectionPagesManageResponse>("POST", this.collectionUrl({ pk: collectionId }), {
      data,
    });
  }

  /**
   * Pages eligible to attach; raw array, no pagination. `search` works live but is absent from the golden's declared params — passed through anyway.
   */
  async search(
    collectionId: string,
    params?: { fields?: readonly CollectionPageSearchField[]; search?: string }
  ): Promise<CollectionPageSearch[]> {
    return this.transport.request<CollectionPageSearch[]>("GET", this.urlFor(PAGES_SEARCH_PATH, { pk: collectionId }), {
      params: this.query(params as Record<string, unknown>, "search"),
    });
  }
}
