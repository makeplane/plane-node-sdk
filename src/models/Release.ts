import { BaseModel } from "./common";

/**
 * Release model interfaces
 */
export type ReleaseStatus = "unreleased" | "released" | "cancelled";

export interface Release extends BaseModel {
  name: string;
  /**
   * Returned as a nested object ({description_html, description_json, ...}),
   * not a plain string. Write it with description_html / description_json.
   */
  description?: Record<string, unknown> | string;
  start_date?: string;
  target_date?: string;
  release_date?: string;
  status?: ReleaseStatus | string;
  lead?: string;
  tag?: string;
  is_latest?: boolean;
  is_prerelease?: boolean;
  logo_props?: Record<string, unknown>;
  workspace: string;
}

export interface CreateRelease {
  name: string;
  description_html?: string;
  description_json?: Record<string, unknown>;
  status?: ReleaseStatus | string;
  target_date?: string;
  release_date?: string;
  lead?: string;
  tag?: string;
  is_prerelease?: boolean;
  external_source?: string;
  external_id?: string;
}

export type UpdateRelease = Partial<CreateRelease>;

// ─── Release Tags ────────────────────────────────────────────────────────────

/**
 * A tag is a version marker (version + optional git metadata), not a label.
 */
export interface ReleaseTag extends BaseModel {
  version: string;
  description?: string;
  commit_hash?: string;
  git_tag?: string;
  workspace: string;
  /** @deprecated Ignored by the API. Kept for backward compatibility. */
  name?: string;
  /** @deprecated Ignored by the API. Kept for backward compatibility. */
  color?: string;
}

export interface CreateReleaseTag {
  /** Must be unique in the workspace */
  version: string;
  description?: string;
  commit_hash?: string;
  git_tag?: string;
  /** @deprecated Ignored by the API. Kept for backward compatibility. */
  name?: string;
  /** @deprecated Ignored by the API. Kept for backward compatibility. */
  color?: string;
}

export interface UpdateReleaseTag {
  version?: string;
  description?: string;
  commit_hash?: string;
  git_tag?: string;
}

// ─── Release Labels ──────────────────────────────────────────────────────────

export interface ReleaseLabel extends BaseModel {
  name: string;
  color?: string;
  sort_order?: number;
  workspace: string;
}

export type CreateReleaseLabel = Pick<ReleaseLabel, "name" | "color">;

export interface UpdateReleaseLabel {
  name?: string;
  color?: string;
  sort_order?: number;
}

// ─── Release Item Labels ─────────────────────────────────────────────────────

export interface AddReleaseItemLabel {
  label_ids: string[];
}

export interface RemoveReleaseItemLabel {
  label_ids: string[];
}

// ─── Release Changelog ───────────────────────────────────────────────────────

export interface ReleaseChangelog {
  id?: string;
  /** Nested description object; write it with description_html / description_json */
  description?: Record<string, unknown> | string;
  release?: string;
  workspace?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

export interface UpdateReleaseChangelog {
  description_html?: string;
  description_json?: Record<string, unknown>;
}

// ─── Release Comments ────────────────────────────────────────────────────────

export interface ReleaseComment {
  id?: string;
  /** Nested object ({description_html, ...}). Write it with comment_html. */
  comment?: Record<string, unknown> | string;
  is_hidden?: boolean;
  is_resolved?: boolean;
  parent?: string;
  edited_at?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

export interface CreateReleaseComment {
  comment_html: string;
  parent?: string;
}

export interface UpdateReleaseComment {
  comment_html?: string;
  is_resolved?: boolean;
}

// ─── Release Links ───────────────────────────────────────────────────────────

export interface ReleaseLink {
  id?: string;
  title?: string;
  url?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  workspace?: string;
  release?: string;
}

export interface CreateReleaseLink {
  url: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateReleaseLink {
  url?: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

// ─── Release Work Items ──────────────────────────────────────────────────────

export interface ReleaseWorkItem {
  id: string;
  name?: string;
  project_id?: string;
  [key: string]: unknown;
}

export interface AddReleaseWorkItems {
  work_item_ids: string[];
}

export interface RemoveReleaseWorkItems {
  work_item_ids: string[];
}
