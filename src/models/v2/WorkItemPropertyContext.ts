import { WorkItemPropertyOptionLite } from "./WorkItemPropertyOption";

/** One option seeded/reconciled inline on write; unlike {@link WorkItemPropertyOptionSeed}, carries optional `id` + `sort_order`. */
export interface WorkItemPropertyContextOptionInput {
  name: string;
  id?: string;
  description?: string;
  is_default?: boolean;
  sort_order?: number;
}

/** Workspace-scoped context scoping a property's applicability/default to projects or work item types. */
export interface WorkItemPropertyContext {
  id: string;
  applies_to_all_projects?: boolean;
  applies_to_all_work_item_types?: boolean;
  created_at?: string;
  default_value?: string[];
  external_id?: string | null;
  external_source?: string | null;
  is_default?: boolean;
  is_multi?: boolean;
  is_required?: boolean;
  /** Resolved work item type ids this context applies to. Golden name kept as-is (upstream `issue_*` pass-through). */
  issue_type_ids?: string[];
  name?: string;
  options?: WorkItemPropertyOptionLite[];
  /** Resolved project ids this context applies to. */
  project_ids?: string[];
  settings?: unknown;
  sort_order?: number;
}

/** POST body — every field optional per the golden (no `required` list). */
export interface CreateWorkItemPropertyContext {
  applies_to_all_projects?: boolean;
  applies_to_all_work_item_types?: boolean;
  default_value?: string[];
  external_id?: string | null;
  external_source?: string | null;
  is_multi?: boolean;
  is_required?: boolean;
  /** Write-only. Ignored when `applies_to_all_work_item_types` is set. */
  issue_type_ids?: string[];
  name?: string;
  /** Write-only. */
  options?: WorkItemPropertyContextOptionInput[];
  /** Write-only. Ignored when `applies_to_all_projects` is set. */
  project_ids?: string[];
  settings?: unknown;
  sort_order?: number;
}

/** PATCH body — every field optional (already true of the write request, but kept distinct for symmetry). v2 has no PUT. */
export type UpdateWorkItemPropertyContext = Partial<CreateWorkItemPropertyContext>;
