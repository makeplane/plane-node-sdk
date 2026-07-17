import { BaseModel } from "./common";

/**
 * Release status lifecycle values
 */
export enum ReleaseStatus {
  UNRELEASED = "unreleased",
  RELEASED = "released",
  CANCELLED = "cancelled",
}

/**
 * Rich-text description payload returned by release endpoints.
 * Written via `description_html` / `description_json`, read back nested.
 */
export interface ReleaseDescription {
  description_html?: string;
  description_json?: Record<string, any>;
  description_binary?: string | null;
  description_stripped?: string | null;
}

/**
 * Release model interfaces
 * Releases are workspace-scoped, versioned deliverables.
 */
export interface Release extends BaseModel {
  name: string;
  description?: ReleaseDescription;
  status: ReleaseStatus;
  // YYYY-MM-DD format
  target_date?: string | null;
  // YYYY-MM-DD format
  release_date?: string | null;
  // User id of the release lead
  lead?: string | null;
  // Release tag id
  tag?: string | null;
  is_latest: boolean;
  is_prerelease: boolean;
  workspace: string;
}

/**
 * Payload for creating a release.
 * Note: rich text is written through `description_html` / `description_json`,
 * which differs from the nested `description` field returned in responses.
 */
export interface CreateRelease {
  name: string;
  description_html?: string;
  description_json?: Record<string, any>;
  status?: ReleaseStatus;
  // YYYY-MM-DD format
  target_date?: string | null;
  // YYYY-MM-DD format
  release_date?: string | null;
  // User id of the release lead
  lead?: string | null;
  // Release tag id
  tag?: string | null;
  is_latest?: boolean;
  is_prerelease?: boolean;
  external_id?: string;
  external_source?: string;
}

export type UpdateRelease = Partial<CreateRelease>;

export interface ListReleasesParams {
  per_page?: number;
  cursor?: string;
  [key: string]: any;
}

export interface AddReleaseLabelsRequest {
  label_ids: string[];
}

export interface RemoveReleaseLabelsRequest {
  label_ids: string[];
}

export interface AddReleaseWorkItemsRequest {
  work_item_ids: string[];
}

export interface RemoveReleaseWorkItemsRequest {
  work_item_ids: string[];
}

/**
 * Response returned when work items are added to a release.
 */
export interface AddReleaseWorkItemsResponse {
  message: string;
}

/**
 * Work item row returned when listing the work items in a release.
 */
export interface ReleaseWorkItem {
  id: string;
  project_id: string;
  name: string;
}
