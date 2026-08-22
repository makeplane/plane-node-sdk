/** A workspace-scoped file asset (two-step S3 upload). Every field except `id` is optional. */
export interface WorkspaceAsset {
  id: string;
  asset_url?: string | null;
  attributes?: unknown;
  content_type?: string | null;
  created_at?: string;
  created_by_id?: string | null;
  entity_type?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  is_uploaded?: boolean;
  name?: string | null;
  size?: number;
}

/** POST body for the upload-credential step. Golden documents 200 as flat {@link WorkspaceAsset}, but the live view returns `{ ..., asset }` — read `.asset`. */
export interface WorkspaceAssetUploadRequest {
  name: string;
  size: number;
  /** Defaults to `"WORK_ITEM_IMPORT"`. */
  entity_type?: string;
  /** Defaults to `"application/octet-stream"`. */
  type?: string;
}

/** PATCH body for the confirm-upload step. Genuinely empty — the view ignores the body and marks it uploaded. */
export type WorkspaceAssetConfirmRequest = Record<string, never>;
