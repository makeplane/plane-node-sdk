import { BaseModel, PropertyRelationType, PropertyType } from "./common";

/**
 * Customer model interfaces
 * TODO: Replace with proper types after API verification
 */
export interface Customer extends BaseModel {
  // Basic customer fields - these will be updated with proper types
  name: string;
  email?: string;
  workspace: string;
  created_by: string;
  updated_by?: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export type CreateCustomer = Partial<Customer>;

export type UpdateCustomer = Partial<Customer>;

export interface ListCustomersParams {
  workspace?: string;
  limit?: number;
  offset?: number;
}

/**
 * Customer Property Value model interfaces
 * TODO: Replace with proper types after API verification
 */
export interface CustomerPropertyValue extends BaseModel {
  // Basic customer property value fields
  value: any;
  property: string;
  customer: string;
  workspace: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export interface CustomPropertyValueResponse {
  [propertyId: string]: any[];
}

export type UpdateCustomerPropertyValue = {
  values: any[];
};

export interface ListCustomerPropertyValuesParams {
  customer?: string;
  property?: string;
  workspace?: string;
  limit?: number;
  offset?: number;
}

/**
 * Customer Request model interfaces
 * TODO: Replace with proper types after API verification
 */
export interface CustomerRequest extends BaseModel {
  // Basic customer request fields
  title: string;
  description?: string;
  customer: string;
  workspace: string;
  created_by: string;
  updated_by?: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export type CreateCustomerRequest = Partial<CustomerRequest>;

export type UpdateCustomerRequest = Partial<CustomerRequest>;

export interface ListCustomerRequestsParams {
  customer?: string;
  workspace?: string;
  limit?: number;
  offset?: number;
}

export interface ListCustomerPropertiesParams {
  workspace?: string;
  limit?: number;
  offset?: number;
}

export interface CustomerProperty extends BaseModel {
  name?: string;
  display_name: string;
  description?: string;
  logo_props?: any;
  sort_order?: number;
  property_type: PropertyType;
  relation_type?: PropertyRelationType;
  is_required?: boolean;
  default_value?: string[];
  settings?: any;
  is_active?: boolean;
  is_multi?: boolean;
  validation_rules?: any;
  workspace?: string;
}

export interface CreateCustomerPropertyRequest {
  name?: string;
  display_name?: string;
  description?: string;
  logo_props?: any;
  sort_order?: number;
  property_type?: PropertyType;
  relation_type?: PropertyRelationType;
  is_required?: boolean;
  default_value?: string[];
  settings?: any;
  is_active?: boolean;
  is_multi?: boolean;
  validation_rules?: any;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
}

export interface UpdateCustomerPropertyRequest {
  name?: string;
  display_name?: string;
  description?: string;
  logo_props?: any;
  sort_order?: number;
  property_type?: PropertyType;
  relation_type?: PropertyRelationType;
  is_required?: boolean;
  default_value?: string[];
  settings?: any;
  is_active?: boolean;
  is_multi?: boolean;
  validation_rules?: any;
  external_source?: string;
  external_id?: string;
  created_by?: string;
  updated_by?: string;
}

export interface LinkIssuesToCustomerResponse {
  message: string;
  linked_issues: LinkedIssue[];
}

export interface LinkedIssue {
  id: string;
  name: string;
  sequence_id: number;
  project_id: string;
  project__identifier: string;
}
