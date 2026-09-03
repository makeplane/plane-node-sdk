import { CollectionMember, CollectionMemberAddItem } from "../../../models/v2/Collection";
import { EXPAND, FIELDS } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type CollectionMemberField = (typeof FIELDS)["collections_members_list"][number];
export type CollectionMemberExpand = (typeof EXPAND)["collections_members_list"][number];

export interface ListCollectionMembersParams {
  fields?: readonly CollectionMemberField[];
  expand?: readonly CollectionMemberExpand[];
}

/** Collection membership, at `...collections.members` — `list` (raw array, no pagination) plus `add`/`remove`. */
export class CollectionMembers extends V2Resource<CollectionMember, never, never> {
  protected path = "/workspaces/{slug}/collections/{pk}/members/";
  protected operations: Record<string, AnyOperationId> = {
    list: "collections_members_list",
    manage: "collections_members",
  };

  /** Every member row for the collection — not paginated; see the class doc comment. */
  async list(collectionId: string, params?: ListCollectionMembersParams): Promise<CollectionMember[]> {
    return this.transport.request<CollectionMember[]>("GET", this.collectionUrl({ pk: collectionId }), {
      params: this.query(params as Record<string, unknown>, "list"),
    });
  }

  /** Add members (1..100); re-adding an existing member with a different `access` updates that row. Resolves to the user ids added/updated. */
  add(collectionId: string, members: readonly CollectionMemberAddItem[]): Promise<string[]> {
    return this.doBridge("add", members, { pk: collectionId });
  }

  /** Remove members by user id (1..100); resolves to the user ids actually removed. */
  remove(collectionId: string, userIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", userIds, { pk: collectionId });
  }
}
