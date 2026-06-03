import { BaseModel } from "./common";

/**
 * Workspace-level template model interfaces
 * These are distinct from project-scoped templates (ProjectTemplate.ts)
 */

// ─── Work Item Templates ─────────────────────────────────────────────────────

export interface WorkspaceWorkItemTemplate extends BaseModel {
  name: string;
  description?: string;
  description_html?: string;
  template_data?: Record<string, unknown>;
  logo_props?: Record<string, unknown>;
  workspace: string;
}

export type CreateWorkspaceWorkItemTemplate = Pick<
  WorkspaceWorkItemTemplate,
  "name" | "description" | "description_html" | "template_data" | "logo_props"
>;

export type UpdateWorkspaceWorkItemTemplate = Partial<CreateWorkspaceWorkItemTemplate>;

// ─── Project Templates ───────────────────────────────────────────────────────

export interface WorkspaceProjectTemplate extends BaseModel {
  name: string;
  description?: string;
  logo_props?: Record<string, unknown>;
  template_data?: Record<string, unknown>;
  workspace: string;
}

export type CreateWorkspaceProjectTemplate = Pick<
  WorkspaceProjectTemplate,
  "name" | "description" | "logo_props" | "template_data"
>;

export type UpdateWorkspaceProjectTemplate = Partial<CreateWorkspaceProjectTemplate>;

// ─── Page Templates ──────────────────────────────────────────────────────────

export interface WorkspacePageTemplate extends BaseModel {
  name: string;
  description?: string;
  description_html?: string;
  template_data?: Record<string, unknown>;
  logo_props?: Record<string, unknown>;
  workspace: string;
}

export type CreateWorkspacePageTemplate = Pick<
  WorkspacePageTemplate,
  "name" | "description" | "description_html" | "template_data" | "logo_props"
>;

export type UpdateWorkspacePageTemplate = Partial<CreateWorkspacePageTemplate>;
