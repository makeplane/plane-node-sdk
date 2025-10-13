import { BaseModel } from './common';

/**
 * Page model interfaces
 * TODO: Replace with proper types after API verification
 */
export interface Page extends BaseModel {
  // Basic page fields - these will be updated with proper types
  name: string;
  description?: string;
  content?: string;
  workspace?: string;
  project?: string;
  created_by: string;
  updated_by?: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export type CreatePage = Partial<Page>;

export type UpdatePage = Partial<Page>;

export interface ListPagesParams {
  workspace?: string;
  project?: string;
  limit?: number;
  offset?: number;
}
