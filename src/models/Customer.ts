import { BaseModel } from './common';

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

/**
 * Customer Property model interfaces (for property definitions)
 * TODO: Replace with proper types after API verification
 */
export interface CustomerProperty extends BaseModel {
  // Basic customer property definition fields
  name: string;
  display_name: string;
  property_type: string;
  description?: string;
  is_required: boolean;
  is_active: boolean;
  workspace: string;
  created_by: string;
  updated_by?: string;
  // Additional fields will be added after API verification
  [key: string]: any;
}

export type CreateCustomerProperty = Partial<CustomerProperty>;

export type UpdateCustomerProperty = Partial<CustomerProperty>;

export interface ListCustomerPropertiesParams {
  workspace?: string;
  limit?: number;
  offset?: number;
}
