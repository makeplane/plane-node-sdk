import { BaseModel, LogoProps } from "./common";

/**
 * Sticky model interfaces
 */
export interface Sticky extends BaseModel {
  name?: string;
  description?: Record<string, any>;
  description_html?: string;
  description_stripped?: string;
  description_binary?: string;
  logo_props?: LogoProps;
  color?: string;
  background_color?: string;
  workspace: string;
  owner: string;
  sort_order: number;
}

export type CreateSticky = Omit<Sticky, "id" | "created_at" | "updated_at" | "deleted_at" | "created_by" | "updated_by" | "workspace" | "owner"> & {
  sort_order?: number;
};

export type UpdateSticky = Partial<CreateSticky>;

export interface ListStickiesParams {
  limit?: number;
  offset?: number;
  [key: string]: any;
}

