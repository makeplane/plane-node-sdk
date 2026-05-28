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

export interface CreateWorkItemTemplate {
  name: string;
  short_description?: string;
  template_data?: Record<string, unknown>;
}

export interface UpdateWorkItemTemplate {
  name?: string;
  short_description?: string;
  template_data?: Record<string, unknown>;
}

export interface PageTemplate extends BaseModel {
  name: string;
  short_description?: string;
  template_data?: Record<string, unknown>;
  template_type?: string;
  project: string;
  workspace: string;
}

export interface CreatePageTemplate {
  name: string;
  short_description?: string;
  template_data?: Record<string, unknown>;
}

export interface UpdatePageTemplate {
  name?: string;
  short_description?: string;
  template_data?: Record<string, unknown>;
}
