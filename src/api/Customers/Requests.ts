import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CustomerRequest,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  ListCustomerRequestsParams,
} from "../../models/Customer";
import { PaginatedResponse } from "../../models/common";

/**
 * Customer Requests API resource
 * Handles customer request operations
 */
export class Requests extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List customer requests
   */
  async list(
    workspaceSlug: string,
    customerId: string,
    params?: ListCustomerRequestsParams
  ): Promise<PaginatedResponse<CustomerRequest>> {
    return this.get<PaginatedResponse<CustomerRequest>>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/requests/`,
      params
    );
  }

  /**
   * Create customer request
   */
  async create(
    workspaceSlug: string,
    customerId: string,
    createRequest: CreateCustomerRequest
  ): Promise<CustomerRequest> {
    return this.post<CustomerRequest>(`/workspaces/${workspaceSlug}/customers/${customerId}/requests/`, createRequest);
  }

  /**
   * Retrieve customer request
   */
  async retrieve(workspaceSlug: string, customerId: string, requestId: string): Promise<CustomerRequest> {
    return this.get<CustomerRequest>(`/workspaces/${workspaceSlug}/customers/${customerId}/requests/${requestId}/`);
  }

  /**
   * Update customer request
   */
  async update(
    workspaceSlug: string,
    customerId: string,
    requestId: string,
    updateRequest: UpdateCustomerRequest
  ): Promise<CustomerRequest> {
    return this.patch<CustomerRequest>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/requests/${requestId}/`,
      updateRequest
    );
  }

  /**
   * Delete customer request
   */
  async delete(workspaceSlug: string, customerId: string, requestId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/customers/${customerId}/requests/${requestId}/`);
  }
}
