import { BaseModel } from "./common";

/**
 * Page model interfaces
 * TODO: Replace with proper types after API verification
 */
export interface Page extends BaseModel {
  // Basic page fields - these will be updated with proper types
  name: string;
  description_html: string;
  description_binary: string;
  description: string;
  description_stripped: string;
  created_by: string;
  updated_by?: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export type CreatePage = Partial<Page>;
