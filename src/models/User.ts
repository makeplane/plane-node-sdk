export interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  avatar_url?: string; // Avatar URL
  display_name?: string;
}

/**
 * Type of user asset being uploaded.
 */
export type UserAssetEntityType = "USER_AVATAR" | "USER_COVER";

/**
 * Request model for uploading a user asset (avatar or cover).
 */
export interface UserAssetUploadRequest {
  /** Original filename of the asset */
  name: string;
  /** MIME type of the file */
  type?: "image/jpeg" | "image/png" | "image/webp" | "image/jpg" | "image/gif";
  /** File size in bytes */
  size: number;
  /** Type of user asset */
  entity_type: UserAssetEntityType;
}

/**
 * Response from the user asset upload endpoint.
 */
export interface UserAssetUploadResponse {
  [key: string]: unknown;
}
