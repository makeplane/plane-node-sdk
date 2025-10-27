import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CustomerProperty,
  CustomerPropertyValue,
  UpdateCustomerPropertyValue,
  ListCustomerPropertyValuesParams,
  ListCustomerPropertiesParams,
  CreateCustomerPropertyRequest,
  UpdateCustomerPropertyRequest,
} from "../../models/Customer";

/**
 * Customer Properties API resource
 * Handles customer property definitions and property value operations
 */
export class Properties extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  // ===== CUSTOMER PROPERTY DEFINITIONS API METHODS =====

  /**
   * List customer properties
   */
  async listPropertyDefinitions(
    workspaceSlug: string,
    params?: ListCustomerPropertiesParams
  ): Promise<CustomerProperty[]> {
    return this.get<CustomerProperty[]>(
      `/workspaces/${workspaceSlug}/customer-properties/`,
      params
    );
  }

  /**
   * Create customer property
   */
  async createPropertyDefinition(
    workspaceSlug: string,
    createProperty: CreateCustomerPropertyRequest
  ): Promise<CustomerProperty> {
    return this.post<CustomerProperty>(
      `/workspaces/${workspaceSlug}/customer-properties/`,
      createProperty
    );
  }

  /**
   * Retrieve customer property
   */
  async retrievePropertyDefinition(
    workspaceSlug: string,
    propertyId: string
  ): Promise<CustomerProperty> {
    return this.get<CustomerProperty>(
      `/workspaces/${workspaceSlug}/customer-properties/${propertyId}/`
    );
  }

  /**
   * Update customer property
   */
  async updatePropertyDefinition(
    workspaceSlug: string,
    propertyId: string,
    updateProperty: UpdateCustomerPropertyRequest
  ): Promise<CustomerProperty> {
    return this.patch<CustomerProperty>(
      `/workspaces/${workspaceSlug}/customer-properties/${propertyId}/`,
      updateProperty
    );
  }

  /**
   * Delete customer property
   */
  async deletePropertyDefinition(
    workspaceSlug: string,
    propertyId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/customer-properties/${propertyId}/`
    );
  }

  // ===== CUSTOMER PROPERTY VALUES API METHODS =====

  /**
   * Get customer property values
   */
  async listValues(
    workspaceSlug: string,
    customerId: string,
    params?: ListCustomerPropertyValuesParams
  ): Promise<CustomerPropertyValue[]> {
    return this.get<CustomerPropertyValue[]>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/property-values/`,
      params
    );
  }

  /**
   * Get single property value
   */
  async retrieveValue(
    workspaceSlug: string,
    customerId: string,
    propertyId: string
  ): Promise<CustomerPropertyValue> {
    return this.get<CustomerPropertyValue>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/property-values/${propertyId}/`
    );
  }

  /**
   * Update single property value
   */
  async updateValue(
    workspaceSlug: string,
    customerId: string,
    propertyId: string,
    updatePropertyValue: UpdateCustomerPropertyValue
  ): Promise<CustomerPropertyValue> {
    return this.patch<CustomerPropertyValue>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/property-values/${propertyId}/`,
      updatePropertyValue
    );
  }
}
