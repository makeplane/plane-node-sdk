import { BaseModel } from './common';

/**
 * Link model interfaces
 * TODO: Replace with proper types after API verification
 */
export interface Link extends BaseModel {
  // Basic link fields - these will be updated with proper types
  title: string;
  url: string;
  issue: string;
  workspace: string;
  project: string;
  created_by: string;
  updated_by?: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export type CreateLink = Partial<Link>;

export type UpdateLink = Partial<Link>;

export interface ListLinksParams {
  issue?: string;
  project?: string;
  workspace?: string;
  limit?: number;
  offset?: number;
}
