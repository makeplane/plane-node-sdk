import {
  CollectionMember,
  CollectionMembersManageRequest,
  CollectionMembersManageResponse,
} from "../../../models/v2/Collection";
import { EXPAND, FIELDS } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type CollectionMemberField = (typeof FIELDS)["collections_members_list"][number];
export type CollectionMemberExpand = (typeof EXPAND)["collections_members_list"][number];

export interface ListCollectionMembersParams {
  fields?: readonly CollectionMemberField[];
  expand?: readonly CollectionMemberExpand[];
}

/** Collection membership, at `...collections.members`. Returns a raw `CollectionMember[]`, not `Page<T>` — no pagination. */
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

  /** Bulk add/remove members. Re-adding an existing member with a different `access` updates that row. */
  async manage(collectionId: string, data: CollectionMembersManageRequest): Promise<CollectionMembersManageResponse> {
    return this.transport.request<CollectionMembersManageResponse>("POST", this.collectionUrl({ pk: collectionId }), {
      data,
    });
  }
}
