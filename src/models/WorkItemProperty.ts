import { BaseModel, LogoProps } from './common';

export type WorkItemPropertySettings = TTextSettings | undefined;

/**
 * WorkItemProperty model interfaces
 */
export interface WorkItemProperty extends BaseModel {
  name: string;
  display_name: string;
  property_type: WorkItemPropertyType;
  relation_type?: WorkItemPropertyRelationType;
  description?: string;
  options?: Partial<WorkItemPropertyOption>[];
  logo_props: LogoProps;
  sort_order: number;
  is_required: boolean;
  default_value: any;
  settings?: WorkItemPropertySettings;
  is_active: boolean;
  is_multi: boolean;
  validation_rules: any;
  issue_type: string;
  workspace: string;
  project: string;
}

export type CreateWorkItemProperty = Pick<
  WorkItemProperty,
  'name' | 'display_name' | 'property_type' | 'options' | 'settings'
>;

export type UpdateWorkItemProperty = Partial<WorkItemProperty>;

export interface ListWorkItemPropertiesParams {
  project?: string;
  limit?: number;
  offset?: number;
}

export type WorkItemPropertyRelationType = 'USER' | 'ISSUE';

export type WorkItemPropertyType =
  | 'TEXT'
  | 'DECIMAL'
  | 'OPTION'
  | 'BOOLEAN'
  | 'DATETIME'
  | 'RELATION';

export type TTextSettings = {
  display_format: 'single-line' | 'multi-line' | 'readonly';
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
  values: [
    {value: any}
  ];
};

export interface ListWorkItemPropertyValuesParams {
  issue?: string;
  property?: string;
  limit?: number;
  offset?: number;
}
