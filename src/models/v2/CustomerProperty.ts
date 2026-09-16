export type CustomerPropertyType =
  | "TEXT"
  | "DATETIME"
  | "DECIMAL"
  | "BOOLEAN"
  | "OPTION"
  | "RELATION"
  | "URL"
  | "EMAIL"
  | "FILE";

export type CustomerPropertyRelationType = "ISSUE" | "USER";

/** One `OPTION`-type property's option row, on write. */
export interface CreateCustomerPropertyOption {
  name: string;
  description?: string;
  is_default?: boolean;
  external_id?: string | null;
  external_source?: string | null;
}

/** A custom property on a workspace's customers (CRM object, not a work item), workspace-scoped. `name` is a server-derived slug — write `display_name` instead. */
export interface CustomerProperty {
  id: string;
  name?: string;
  display_name?: string;
  description?: string | null;
  property_type?: CustomerPropertyType;
  relation_type?: CustomerPropertyRelationType | null;
  is_active?: boolean;
  is_multi?: boolean;
  is_required?: boolean;
  default_value?: string[];
  /** `OPTION`-type properties' option rows. Untyped in the golden (bare `array` of `{}`). */
  options?: unknown[];
  logo_props?: unknown;
  settings?: unknown;
  validation_rules?: unknown;
  sort_order?: number;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `display_name` and `property_type` are required; `name` is server-derived and not writable. */
export interface CreateCustomerProperty {
  display_name: string;
  property_type: CustomerPropertyType;
  description?: string | null;
  relation_type?: CustomerPropertyRelationType | null;
  is_active?: boolean;
  is_multi?: boolean;
  is_required?: boolean;
  default_value?: string[];
  options?: CreateCustomerPropertyOption[];
  logo_props?: unknown;
  settings?: unknown;
  validation_rules?: unknown;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateCustomerProperty = Partial<CreateCustomerProperty>;
