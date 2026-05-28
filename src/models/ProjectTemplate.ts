import { BaseModel } from "./common";

/**
 * Project template model interfaces
 */
export interface WorkItemTemplate extends BaseModel {
  name: string;
  short_description?: string;
  template_data?: Record<string, unknown>;
  template_type?: string;
  project: string;
  workspace: string;
}

export type CreateWorkItemTemplate = Pick<WorkItemTemplate, "name" | "short_description" | "template_data">;

export type UpdateWorkItemTemplate = Partial<CreateWorkItemTemplate>;

export interface PageTemplate extends BaseModel {
  name: string;
  short_description?: string;
  template_data?: Record<string, unknown>;
  template_type?: string;
  project: string;
  workspace: string;
}

export type CreatePageTemplate = Pick<PageTemplate, "name" | "short_description" | "template_data">;

export type UpdatePageTemplate = Partial<CreatePageTemplate>;
