import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import {
  Customer,
  CreateCustomer,
  UpdateCustomer,
  ListCustomersParams,
} from '../../models/Customer';
import { Properties } from './Properties';
import { Requests } from './Requests';

/**
 * Customers API resource
 * Handles basic customer operations
 * Note: Based on the API documentation, this handles customer-level operations
 */
export class Customers extends BaseResource {
  public properties: Properties;
  public requests: Requests;

  constructor(config: Configuration) {
    super(config);
    this.properties = new Properties(config);
    this.requests = new Requests(config);
  }

  /**
   * Create a new customer
   */
  async create(
    workspaceSlug: string,
    createCustomer: CreateCustomer
  ): Promise<Customer> {
    return this.post<Customer>(
      `/workspaces/${workspaceSlug}/customers/`,
      createCustomer
    );
  }

  /**
   * Retrieve a customer by ID
   */
  async retrieve(workspaceSlug: string, customerId: string): Promise<Customer> {
    return this.get<Customer>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/`
    );
  }

  /**
   * Update a customer
   */
  async update(
    workspaceSlug: string,
    customerId: string,
    updateCustomer: UpdateCustomer
  ): Promise<Customer> {
    return this.patch<Customer>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/`,
      updateCustomer
    );
  }

  /**
   * Delete a customer
   */
  async del(workspaceSlug: string, customerId: string): Promise<void> {
    return this.delete(`/workspaces/${workspaceSlug}/customers/${customerId}/`);
  }

  /**
   * List customers with optional filtering
   */
  async list(
    workspaceSlug: string,
    params?: ListCustomersParams
  ): Promise<Customer[]> {
    return this.get<Customer[]>(
      `/workspaces/${workspaceSlug}/customers/`,
      params
    );
  }

  // ===== CUSTOMER ISSUES API METHODS =====

  /**
   * List customer issues
   */
  async listCustomerIssues(
    workspaceSlug: string,
    customerId: string
  ): Promise<any[]> {
    return this.get<any[]>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/issues/`
    );
  }

  /**
   * Link issues to customer
   */
  async linkIssuesToCustomer(
    workspaceSlug: string,
    customerId: string,
    issueIds: string[]
  ): Promise<any> {
    return this.post<any>(
      `/workspaces/${workspaceSlug}/customers/${customerId}/issues/`,
      { issue_ids: issueIds }
    );
  }

  /**
   * Unlink issue from customer
   */
  async unlinkIssueFromCustomer(
    workspaceSlug: string,
    customerId: string,
    issueId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/customers/${customerId}/issues/${issueId}/`
    );
  }
}
