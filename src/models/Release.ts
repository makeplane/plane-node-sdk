import { BaseModel } from "./common";

/**
 * Release model interfaces
 */
export interface Release extends BaseModel {
  name: string;
  description?: string;
  start_date?: string;
  release_date?: string;
  status?: string;
  logo_props?: Record<string, unknown>;
  workspace: string;
}

export type CreateRelease = Pick<
  Release,
  "name" | "description" | "start_date" | "release_date" | "status" | "logo_props"
>;

export type UpdateRelease = Partial<CreateRelease>;

// ─── Release Tags ────────────────────────────────────────────────────────────

export interface ReleaseTag extends BaseModel {
  name: string;
  color?: string;
  sort_order?: number;
  workspace: string;
}

export type CreateReleaseTag = Pick<ReleaseTag, "name" | "color">;

// ─── Release Labels ──────────────────────────────────────────────────────────

export interface ReleaseLabel extends BaseModel {
  name: string;
  color?: string;
  sort_order?: number;
  workspace: string;
}

export type CreateReleaseLabel = Pick<ReleaseLabel, "name" | "color">;

// ─── Release Item Labels ─────────────────────────────────────────────────────

export interface AddReleaseItemLabel {
  label_ids: string[];
}
