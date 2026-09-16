import { WorkItemPropertyOptionLite, WorkItemPropertyOptionSeed } from "./WorkItemPropertyOption";

export type WorkItemPropertyType =
  | "TEXT"
  | "DATETIME"
  | "DECIMAL"
  | "BOOLEAN"
  | "OPTION"
  | "RELATION"
  | "URL"
  | "EMAIL"
  | "FILE"
  | "FORMULA";

export type WorkItemPropertyRelationType = "ISSUE" | "USER" | "RELEASE" | "RICH_TEXT";

/** A custom work item property definition — project- or workspace-scoped, same shape either way. */
export interface WorkItemProperty {
  id: string;
  created_at?: string;
  default_value?: string[];
  description?: string | null;
  display_name?: string;
  external_id?: string | null;
  external_source?: string | null;
  is_active?: boolean;
  is_multi?: boolean;
  is_required?: boolean;
  /** Untyped in the golden (no fixed shape declared for the icon/emoji payload). */
  logo_props?: unknown;
  name?: string;
  /** Inlined for OPTION-typed properties; empty/absent otherwise. */
  options?: WorkItemPropertyOptionLite[];
  property_type?: WorkItemPropertyType;
  relation_type?: WorkItemPropertyRelationType | null;
  settings?: unknown;
  validation_rules?: unknown;
}

/** POST body. `display_name`/`property_type` required. `options` (write-only) seeds OPTION values on create only. */
export interface CreateWorkItemProperty {
  display_name: string;
  property_type: WorkItemPropertyType;
  default_value?: string[];
  description?: string | null;
  external_id?: string | null;
  external_source?: string | null;
  is_active?: boolean;
  is_multi?: boolean;
  is_required?: boolean;
  options?: WorkItemPropertyOptionSeed[];
  relation_type?: WorkItemPropertyRelationType | null;
  settings?: unknown;
  validation_rules?: unknown;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateWorkItemProperty = Partial<CreateWorkItemProperty>;
