/**
 * Presigned download details for a workspace asset.
 *
 * Returned by `client.workspace.getAsset()`. `asset_url` is time-limited and can
 * be fetched without Plane authentication. It is `null` when the server could not
 * presign the stored file (the endpoint still answers 200 in that case).
 */
export interface WorkspaceAssetDownload {
  asset_id: string;
  asset_url: string | null;
  asset_name?: string | null;
  asset_type?: string | null;
}
