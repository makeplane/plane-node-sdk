import { WorkItemPriority } from "./WorkItem";

/** The seed payload a template instantiates from — nested under `template_data` on read, required on write. */
export interface WorkItemTemplateData {
  name: string;
  description_html?: string;
  /** Defaults to `"none"`. */
  priority?: WorkItemPriority;
  assignees?: unknown;
  labels?: unknown;
  modules?: unknown;
  properties?: unknown;
  state?: unknown;
  type?: unknown;
}

/** A work-item template (api_v2) — a reusable seed instantiated via `use`. Project- or workspace-scoped, same row shape. */
export interface WorkItemTemplate {
  id: string;
  created_at?: string;
  created_by_id?: string | null;
  description_html?: string;
  is_published?: boolean;
  name?: string;
  short_description?: string | null;
  short_id?: string | null;
  slug?: string | null;
  template_data?: WorkItemTemplateData | null;
  template_type?: string;
}

/** POST body. `name` and `template_data` are required by the API. */
export interface CreateWorkItemTemplate {
  name: string;
  template_data: WorkItemTemplateData;
  /** Defaults to `"<p></p>"`. */
  description_html?: string;
  /** Defaults to `false`. */
  is_published?: boolean;
  short_description?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateWorkItemTemplate = Partial<CreateWorkItemTemplate>;

/** Body for `POST .../work-item-templates/{id}/use/` — optional overrides on top of the template's seed data. */
export interface WorkItemTemplateUseRequest {
  name?: string;
  /** Only meaningful from the workspace-scoped template; the project-scoped route already knows its project. */
  project_id?: string;
}
