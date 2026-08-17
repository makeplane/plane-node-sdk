import { BaseModel } from "./common";

/**
 * Page model interfaces
 * TODO: Replace with proper types after API verification
 */
export interface Page extends BaseModel {
  // Basic page fields - these will be updated with proper types
  name: string;
  description_html?: string;
  description_binary?: string;
  description?: string;
  description_stripped?: string;
  created_by: string;
  updated_by?: string;
  /** 0 = public, 1 = private */
  access?: number;
  is_locked?: boolean;
  /** Set when the page is archived; deleting a page requires it to be archived first */
  archived_at?: string;
  parent_id?: string;
  /**
   * Where the page is filed, and the id of the row that files it there -- the
   * second is what addresses the membership when moving the page between
   * collections. Both are null for a page in no collection.
   */
  collection_id?: string;
  page_collection_id?: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export type CreatePage = Partial<Page> & {
  /** Create the page as a sub-page of this parent page */
  parent_id?: string;
  /** Create the page directly inside this collection */
  collection_id?: string;
};

/**
 * Fields a page update may change. At least one is required; sending neither is
 * refused with 400 "Either name or description_html is required."
 */
export interface UpdatePage {
  name?: string;
  description_html?: string;
}
