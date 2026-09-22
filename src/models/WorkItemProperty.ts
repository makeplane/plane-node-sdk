import { BaseModel, LogoProps, PropertyRelationType, PropertyType } from "./common";

export type WorkItemPropertySettings = TextSettings | undefined;

/**
 * WorkItemProperty model interfaces
 */
export interface WorkItemProperty extends BaseModel {
  name: string;
  property_type: PropertyType;
  display_name: string;
  description?: string;
  relation_type: PropertyRelationType | undefined;
  options?: Partial<WorkItemPropertyOption>[];
  settings?: WorkItemPropertySettings;
  logo_props: LogoProps;
  sort_order: number;
  is_required: boolean;
  default_value: any;
  is_active: boolean;
  is_multi: boolean;
  validation_rules: any;
  issue_type: string;
  workspace: string;
  project: string;
}

/**
 * CreateWorkItemProperty model interface
 * This is the model used to create a new work item property to add validations according to the property type
 * as defined above.
 */

// Base interface for creating work item properties (excluding auto-generated fields)
interface BaseCreateWorkItemProperty {
  name: string;
  display_name: string;
  description?: string;
  property_type: PropertyType;
  settings?: WorkItemPropertySettings;
  logo_props?: LogoProps;
  sort_order?: number;
  is_required: boolean;
  default_value?: any;
  is_active?: boolean;
  relation_type?: PropertyRelationType;
  options?: Partial<WorkItemPropertyOption>[];
  is_multi?: boolean;
}

// Specific interfaces for each property type with their required fields
interface CreateTextWorkItemProperty extends BaseCreateWorkItemProperty {
  property_type: "TEXT";
  settings?: TextSettings;
}

interface CreateDecimalWorkItemProperty extends BaseCreateWorkItemProperty {
  property_type: "DECIMAL";
}

interface CreateOptionWorkItemProperty extends BaseCreateWorkItemProperty {
  property_type: "OPTION";
  options?: Partial<WorkItemPropertyOption>[];
  is_multi?: boolean;
}

interface CreateBooleanWorkItemProperty extends BaseCreateWorkItemProperty {
  property_type: "BOOLEAN";
}

interface CreateDateTimeWorkItemProperty extends BaseCreateWorkItemProperty {
  property_type: "DATETIME";
}

interface CreateRelationWorkItemProperty extends BaseCreateWorkItemProperty {
  property_type: "RELATION";
  relation_type?: PropertyRelationType;
}

export type CreateWorkItemProperty =
  | CreateTextWorkItemProperty
  | CreateDecimalWorkItemProperty
  | CreateOptionWorkItemProperty
  | CreateBooleanWorkItemProperty
  | CreateDateTimeWorkItemProperty
  | CreateRelationWorkItemProperty;

export type UpdateWorkItemProperty = Partial<WorkItemProperty>;

export interface ListWorkItemPropertiesParams {
  project?: string;
  limit?: number;
  offset?: number;
}

export type TextSettings = {
  display_format: "single-line" | "multi-line" | "readonly";
};

/**
 * WorkItemPropertyOption model interfaces
 */
export interface WorkItemPropertyOption extends BaseModel {
  name: string;
  description?: string;
  property: string;
  is_active?: boolean;
  sort_order?: number;
  parent?: string;
  project?: string;
  is_default?: boolean;
  logo_props?: LogoProps;
}

export type CreateWorkItemPropertyOption = Partial<WorkItemPropertyOption>;

export type UpdateWorkItemPropertyOption = Partial<WorkItemPropertyOption>;

export interface ListWorkItemPropertyOptionsParams {
  property?: string;
  limit?: number;
  offset?: number;
}

/**
 * WorkItemPropertyValue model interfaces
 */
export interface WorkItemPropertyValue extends BaseModel {
  value: any;
  property: string;
  issue: string;
  workspace: string;
  project: string;
}

export type WorkItemPropertyValues = {
  property_id: string;
  values: any[];
}[];

/**
 * The value of a rich text property: `property_type: "RELATION"`, `relation_type: "RICH_TEXT"`.
 *
 * Plane requires an object here, not a bare HTML string (a string answers 400 "Rich text
 * value must be an object"), and sanitises the HTML before storing it. Reads return the
 * stored content in {@link WorkItemPropertyValueDetail.value_detail}.
 */
export interface RichTextValue {
  /** The content, as HTML, e.g. `"<p>Notes</p>"` */
  description_html: string;
}

/**
 * The stored content of a rich text property value, as Plane returns it.
 */
export interface RichTextValueDetail {
  /** ID of the stored description; `null` when never set */
  id: string | null;
  /** The content as sanitised HTML */
  description_html: string;
  /** The content as plain text */
  description_stripped: string;
}

/**
 * A single property value, as returned by the per-property `values/` endpoint
 * (`retrieve`, `create`, `update`). A property holding more than one value (multi-select,
 * or a cascading property's levels) answers a list of these instead.
 */
export interface WorkItemPropertyValueDetail {
  id: string;
  property_id: string;
  issue_id: string;
  /**
   * The value, formatted according to the property type. For rich text this is the ID of
   * the stored content; the HTML is in `value_detail`.
   */
  value: string | boolean | number | null;
  value_type?: string | null;
  /** The stored content of a rich text property; absent for every other type. */
  value_detail?: RichTextValueDetail;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * UpdateWorkItemPropertyValue model interface
 * Request model for creating/updating a work item property value.
 *
 * The value type depends on the property type:
 * - TEXT/URL/EMAIL/FILE: string
 * - DATETIME: string (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
 * - DECIMAL: number (int or float)
 * - BOOLEAN: boolean (true/false)
 * - OPTION/RELATION (single): string (UUID)
 * - OPTION/RELATION (multi, when is_multi=True): list of strings (UUIDs) or single string
 * - RELATION with relation_type=RICH_TEXT: {@link RichTextValue}
 *
 * For multi-value properties (is_multi=True):
 * - Accept either a single UUID string or a list of UUID strings
 * - Multiple IssuePropertyValue records are created
 * - Response will be a list of values
 *
 * For single-value properties:
 * - Only one value is allowed per work item/property combination
 */
export type UpdateWorkItemPropertyValue = {
  value: string | boolean | number | string[] | RichTextValue;
  external_id?: string;
  external_source?: string;
};

export interface ListWorkItemPropertyValuesParams {
  issue?: string;
  property?: string;
  limit?: number;
  offset?: number;
}
