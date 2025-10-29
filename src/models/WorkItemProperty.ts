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

export type UpdateWorkItemPropertyValue = {
  values: [{ value: any }];
};

export interface ListWorkItemPropertyValuesParams {
  issue?: string;
  property?: string;
  limit?: number;
  offset?: number;
}
