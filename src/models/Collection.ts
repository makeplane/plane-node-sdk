import { LogoProps } from "./common";

/**
 * Collection model interfaces
 * A collection is a folder that groups workspace pages.
 */

/** Access level of a collection: 0 = public, 1 = private */
export const CollectionAccess = {
  PUBLIC: 0,
  PRIVATE: 1,
} as const;
export type CollectionAccessEnum = (typeof CollectionAccess)[keyof typeof CollectionAccess];

/** Access level of a member within a collection: 0 = view, 1 = comment, 2 = edit */
export const CollectionMemberAccess = {
  VIEW: 0,
  COMMENT: 1,
  EDIT: 2,
} as const;
export type CollectionMemberAccessEnum = (typeof CollectionMemberAccess)[keyof typeof CollectionMemberAccess];

export interface Collection {
  id: string;
  name?: string;
  owned_by_id?: string;
  access?: CollectionAccessEnum;
  current_user_access?: CollectionMemberAccessEnum;
  has_pages?: boolean;
  is_default?: boolean;
  is_global?: boolean;
  logo_props?: LogoProps;
  sort_order?: number;
  workspace?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

export interface CreateCollection {
  name: string;
  access?: CollectionAccessEnum;
  logo_props?: LogoProps;
}

/**
 * Request model for updating a collection.
 * Deliberately has no `access` field — the API rejects (400) any attempt to
 * change a collection's access level after creation.
 */
export interface UpdateCollection {
  name?: string;
  logo_props?: LogoProps;
  sort_order?: number;
}

// ─── Collection Members ──────────────────────────────────────────────────────

export interface CollectionMember {
  id: string;
  collection?: string;
  member?: string;
  access?: CollectionMemberAccessEnum;
  workspace?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

export interface CreateCollectionMember {
  /** User id of the member to add */
  member: string;
  access: CollectionMemberAccessEnum;
}

export interface UpdateCollectionMember {
  access: CollectionMemberAccessEnum;
}

// ─── Collection Pages ────────────────────────────────────────────────────────

/**
 * Flat page-collection membership record, returned by the move/reorder endpoint.
 */
export interface CollectionPage {
  id: string;
  collection?: string;
  page?: string;
  workspace?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

/**
 * Nested page object inside a CollectionBranchPage row.
 */
export interface CollectionBranchPageDetail {
  id?: string;
  name?: string;
  logo_props?: LogoProps;
  [key: string]: unknown;
}

/**
 * A row in the list-pages-in-collection response, with a nested page object.
 */
export interface CollectionBranchPage {
  page_collection_id?: string;
  collection_id?: string;
  parent_id?: string;
  sort_order?: number;
  page?: CollectionBranchPageDetail;
  [key: string]: unknown;
}

export interface AddCollectionPages {
  page_ids: string[];
  /** Optional explicit sort order per page id */
  sort_orders?: Record<string, number>;
  placement?: Record<string, unknown>;
}

/**
 * Request model for moving/reordering a page within or between collections.
 * Omit `collection` entirely to reorder the page within its current collection
 * — setting it triggers a move to that target collection.
 */
export interface UpdateCollectionPage {
  collection?: string;
  sort_order?: number;
  placement?: Record<string, unknown>;
}

/**
 * A page eligible to be added to a collection.
 */
export interface CollectionPageSearchResult {
  id: string;
  name?: string;
  logo_props?: LogoProps;
  [key: string]: unknown;
}

/**
 * Query params for the list-pages-in-collection endpoint.
 */
export interface ListCollectionPagesParams {
  /** Case-insensitive substring filter on page name */
  search?: string;
  /**
   * Filter to direct children of this page within the collection.
   * Omit to return only top-level (non-sub) pages.
   */
  parent_id?: string;
  per_page?: number;
  cursor?: string;
  [key: string]: unknown;
}
