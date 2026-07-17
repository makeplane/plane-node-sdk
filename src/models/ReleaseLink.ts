import { BaseModel } from "./common";

/**
 * ReleaseLink model interfaces
 * Links are external URLs attached to a release. URLs are unique per release.
 */
export interface ReleaseLink extends BaseModel {
  release: string;
  title: string;
  url: string;
  metadata?: Record<string, any>;
  workspace: string;
}

export interface CreateReleaseLink {
  title: string;
  url: string;
  metadata?: Record<string, any>;
}

export type UpdateReleaseLink = Partial<CreateReleaseLink>;

export interface ListReleaseLinksParams {
  per_page?: number;
  cursor?: string;
  [key: string]: any;
}
