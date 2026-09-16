import { CollectionMember, CollectionMemberAddItem } from "../../../models/v2/Collection";
import { EXPAND, FIELDS } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type CollectionMemberField = (typeof FIELDS)["collections_members_list"][number];
export type CollectionMemberExpand = (typeof EXPAND)["collections_members_list"][number];

export interface ListCollectionMembersParams {
  fields?: readonly CollectionMemberField[];
  expand?: readonly CollectionMemberExpand[];
}

/** Collection membership, reached flat as `v2.workspaces.wiki.collections.members.list(slug, collection)`, or from a fetched collection as `collection.members.list()` — `list` (raw array, no pagination) plus `add`/`remove`. */
export class CollectionMembers extends V2Resource<CollectionMember, never, never> {
  protected path = "/workspaces/{slug}/collections/{collection_id}/members/";
  protected operations: Record<string, AnyOperationId> = {
    list: "collections_members_list",
    // One operation, two verbs — see `CycleWorkItems.operations`.
    add: "collections_members",
    remove: "collections_members",
  };

  /** Every member row for the collection — not paginated; see the class doc comment. */
  list<F extends Exclude<CollectionMemberField, "all"> & keyof CollectionMember>(
    slug: string,
    collection: string,
    params: ListCollectionMembersParams & { fields: readonly F[] }
  ): Promise<Pick<CollectionMember, F | "id">[]>;
  /** Every member row for the collection — not paginated; see the class doc comment. */
  list(slug: string, collection: string, params?: ListCollectionMembersParams): Promise<CollectionMember[]>;
  list(slug: string, collection: string, params?: ListCollectionMembersParams): Promise<CollectionMember[]> {
    return this.doCustomAction<CollectionMember[]>("list", {
      method: "GET",
      pathParams: { slug, collection_id: collection },
      params: params as Record<string, unknown>,
    });
  }

  /** Add members (1..100); re-adding an existing member with a different `access` updates that row. Resolves to the user ids added/updated. */
  add(slug: string, collection: string, members: readonly CollectionMemberAddItem[]): Promise<string[]> {
    return this.doBridge("add", members, { slug, collection_id: collection });
  }

  /** Remove members by user id (1..100); resolves to the user ids actually removed. */
  remove(slug: string, collection: string, userIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", userIds, { slug, collection_id: collection });
  }
}
