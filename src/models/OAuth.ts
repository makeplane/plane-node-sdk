export interface PlaneOAuthTokenResponse {
  access_token: string;
  expires_in?: number;
  token_type: string;
  scope?: string;
  refresh_token?: string;
}

export interface WorkspaceDetail {
  name: string;
  slug: string;
  id: string;
  logo_url?: string;
}

export interface PlaneOAuthAppInstallation {
  id: string;
  workspace_detail: WorkspaceDetail;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  status: string;
  created_by?: string;
  updated_by?: string;
  workspace: string;
  application: string;
  installed_by: string;
  app_bot: string;
  webhook?: string;
}
