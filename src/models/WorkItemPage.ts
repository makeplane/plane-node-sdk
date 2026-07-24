import { LogoProps } from "./common";

/**
 * Work item page link model interfaces
 * Represents a page linked to a work item.
 */

/**
 * Nested page info returned inside a WorkItemPage response
 */
export interface WorkItemPageLite {
  id?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  is_global?: boolean;
  logo_props?: LogoProps;
}

/**
 * Work item to page link
 */
export interface WorkItemPage {
  id?: string;
  page?: WorkItemPageLite;
  issue?: string;
  project?: string;
  workspace?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Request model for linking a page to a work item
 */
export interface CreateWorkItemPageRequest {
  page_id: string;
}
