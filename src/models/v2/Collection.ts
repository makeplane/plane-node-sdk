import { PageAccess } from "./Page";

/** A wiki collection (api_v2). Golden's operation ids for base CRUD are `pages_*`, not `collections_*`; every field except `id` is optional. */
export interface Collection {
  id: string;
  access?: PageAccess;
  created_at?: string;
  created_by_id?: string | null;
  is_default?: boolean;
  is_global?: boolean;
  logo_props?: unknown;
  name?: string;
  owned_by_id?: string;
  page_ids?: string[];
  sort_order?: number;
}

/** POST body. No field is required by the golden. */
export interface CreateCollection {
  access?: PageAccess;
  is_default?: boolean;
  is_global?: boolean;
  logo_props?: unknown;
  name?: string;
  sort_order?: number;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateCollection = Partial<CreateCollection>;

/** `0` = View, `1` = Comment, `2` = Edit. */
export type CollectionMemberAccess = 0 | 1 | 2;

export type CollectionMemberSource = "manual" | "group_sync";

/** Sparse collection membership row — member_id + access level. Every field except `id` is optional. */
export interface CollectionMember {
  id: string;
  access?: CollectionMemberAccess;
  collection_id?: string;
  created_at?: string;
  created_by_id?: string | null;
  member_id?: string;
  source?: CollectionMemberSource;
}

/** One `CollectionMembers.add` entry — `member_id` plus optional access level (defaults to `0`, View). */
export interface CollectionMemberAddItem {
  member_id: string;
  access?: CollectionMemberAccess;
}

/** Lite page shape returned by `GET …/collections/{id}/pages-search/`. Every field except `id` is optional. */
export interface CollectionPageSearch {
  id: string;
  logo_props?: unknown;
  name?: string;
}
