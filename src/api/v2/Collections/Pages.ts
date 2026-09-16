import { CollectionPageSearch } from "../../../models/v2/Collection";
import { FIELDS } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type CollectionPageSearchField = (typeof FIELDS)["collections_pages_search"][number];

/** Page membership of a collection, reached flat as `v2.workspaces.wiki.collections.pages.add(slug, collection, ids)`, or from a fetched collection as `collection.pages.add(ids)` — `add`/`remove` by page id, plus `search`. */
export class CollectionPages extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/collections/{collection_id}/pages/";
  protected extraPaths = {
    // A sibling route, not this collection's own: `urlFor` picks it for `search` and the
    // sweeps read the same template rather than a module-level constant only this file saw.
    search: "/workspaces/{slug}/collections/{collection_id}/pages-search/",
  };
  protected operations: Record<string, AnyOperationId> = {
    search: "collections_pages_search",
    // One operation, two verbs — see `CycleWorkItems.operations`.
    add: "collections_pages",
    remove: "collections_pages",
  };

  /** Move pages into the collection (1..100 ids); resolves to the ids actually added. */
  add(slug: string, collection: string, pageIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", pageIds, { slug, collection_id: collection });
  }

  /** Take pages out of the collection (1..100 ids); resolves to the ids actually removed. */
  remove(slug: string, collection: string, pageIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", pageIds, { slug, collection_id: collection });
  }

  /**
   * Pages eligible to attach; raw array, no pagination. `search` works live but is absent from the golden's declared params — passed through anyway.
   */
  search<F extends Exclude<CollectionPageSearchField, "all"> & keyof CollectionPageSearch>(
    slug: string,
    collection: string,
    params: { fields?: readonly CollectionPageSearchField[]; search?: string } & { fields: readonly F[] }
  ): Promise<Pick<CollectionPageSearch, F | "id">[]>;
  /**
   * Pages eligible to attach; raw array, no pagination. `search` works live but is absent from the golden's declared params — passed through anyway.
   */
  search(
    slug: string,
    collection: string,
    params?: { fields?: readonly CollectionPageSearchField[]; search?: string }
  ): Promise<CollectionPageSearch[]>;
  search(
    slug: string,
    collection: string,
    params?: { fields?: readonly CollectionPageSearchField[]; search?: string }
  ): Promise<CollectionPageSearch[]> {
    return this.doCustomAction<CollectionPageSearch[]>("search", {
      method: "GET",
      pathParams: { slug, collection_id: collection },
      params: params as Record<string, unknown>,
    });
  }
}
