/** `entity_type` accepted by {@link UserAssetUploadRequest}. */
export type UserAssetEntityType = "USER_AVATAR" | "USER_COVER";

/** The calling principal's avatar/cover asset (two-step S3 upload). Not workspace-scoped. */
export interface UserAsset {
  id: string;
  asset_url?: string | null;
  attributes?: unknown;
  content_type?: string | null;
  created_at?: string;
  created_by_id?: string | null;
  entity_type?: string | null;
  is_uploaded?: boolean;
  name?: string | null;
  size?: number;
  user_id?: string | null;
}

/** POST body for the upload-credential step. Golden documents 200 as flat {@link UserAsset}, but the live view returns `{ ..., asset }` — read `.asset`. */
export interface UserAssetUploadRequest {
  entity_type: UserAssetEntityType;
  name: string;
  size: number;
  /** Defaults to `"image/jpeg"`. */
  type?: string;
}

/** PATCH body for the confirm-upload step. Genuinely empty — see {@link WorkspaceAssetConfirmRequest}. */
export type UserAssetConfirmRequest = Record<string, never>;
