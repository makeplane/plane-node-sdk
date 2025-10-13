import { BaseModel } from './common';

/**
 * Attachment model interfaces
 * TODO: Replace with proper types after API verification
 */
export interface Attachment extends BaseModel {
  // Basic attachment fields - these will be updated with proper types
  name: string;
  file: string;
  file_size: number;
  file_type: string;
  issue: string;
  workspace: string;
  project: string;
  created_by: string;
  updated_by?: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export type CreateAttachment = Partial<Attachment>;

export type UpdateAttachment = Partial<Attachment>;

export interface ListAttachmentsParams {
  issue?: string;
  project?: string;
  workspace?: string;
  limit?: number;
  offset?: number;
}
