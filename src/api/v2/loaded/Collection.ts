import type { Collection } from "../../../models/v2/Collection";
import type { CollectionMembers } from "../Collections/Members";
import type { CollectionPages } from "../Collections/Pages";
import type { Loaded, Owned } from "../kernel/loaded";

/** The path ids a child of a collection row needs, in URL order. Collections are workspace-scoped. */
export type CollectionIds = [slug: string, collection: string];

/** The parameter names behind {@link CollectionIds}, in the same order. */
export const COLLECTION_ID_NAMES = ["slug", "collection"] as const;

/** Everything a fetched wiki collection can reach: who is on it, and what is in it. */
export interface CollectionNavigation {
  readonly members: Owned<CollectionMembers, CollectionIds>;
  readonly pages: Owned<CollectionPages, CollectionIds>;
}

/** A fetched collection row that is also the place its members and pages live. */
export type LoadedCollectionRow<TRow> = Loaded<TRow, CollectionNavigation>;

export type LoadedCollection = LoadedCollectionRow<Collection>;
