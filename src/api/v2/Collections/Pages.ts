import { CollectionPageSearch } from "../../../models/v2/Collection";
import { FIELDS } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type CollectionPageSearchField = (typeof FIELDS)["collections_pages_search"][number];

const PAGES_SEARCH_PATH = "/workspaces/{slug}/collections/{pk}/pages-search/";

/** Page membership of a collection, at `...wiki.collections.pages` — `add`/`remove` by page id, plus `search`. */
export class CollectionPages extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/collections/{pk}/pages/";
  protected operations: Record<string, AnyOperationId> = {
    search: "collections_pages_search",
    manage: "collections_pages",
  };

  /** Move pages into the collection (1..100 ids); resolves to the ids actually added. */
  add(collectionId: string, pageIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", pageIds, { pk: collectionId });
  }

  /** Take pages out of the collection (1..100 ids); resolves to the ids actually removed. */
  remove(collectionId: string, pageIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", pageIds, { pk: collectionId });
  }

  /**
   * Pages eligible to attach; raw array, no pagination. `search` works live but is absent from the golden's declared params — passed through anyway.
   */
  async search(
    collectionId: string,
    params?: { fields?: readonly CollectionPageSearchField[]; search?: string }
  ): Promise<CollectionPageSearch[]> {
    return this.transport.request<CollectionPageSearch[]>(
      "GET",
      this.urlForTemplate(PAGES_SEARCH_PATH, "search", { pk: collectionId }),
      {
        params: this.query(params as Record<string, unknown>, "search"),
      }
    );
  }
}
