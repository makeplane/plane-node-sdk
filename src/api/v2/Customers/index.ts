import { Page } from "../../../models/v2/common";
import {
  Customer,
  UpdateCustomer,
  CustomerWorkItemManageRequest,
  CustomerWorkItemManageResponse,
  CreateCustomer,
} from "../../../models/v2/Customer";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { CustomerPropertyValues } from "./PropertyValues";
import { CustomerRequests } from "./Requests";

export type CustomerField = (typeof FIELDS)["customers_list"][number];
export type CustomerOrderBy = (typeof ORDER_BY)["customers_list"][number];

export interface ListCustomersParams {
  fields?: readonly CustomerField[];
  name?: string;
  domain?: string;
  stage?: string;
  contract_status?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: CustomerOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Workspace CRM customers, at `...customers` — CRUD, `upsert`, and sub-resources `requests`/`propertyValues`. */
export class Customers extends V2Resource<Customer, CreateCustomer, UpdateCustomer> {
  protected path = "/workspaces/{slug}/customers/";
  protected operations: Record<string, AnyOperationId> = {
    list: "customers_list",
    retrieve: "customers_retrieve",
    create: "customers_create",
    update: "customers_partial_update",
    upsert: "customers_upsert",
    delete: "customers_destroy",
    manageWorkItems: "customers_work_items",
  };

  public requests: CustomerRequests;
  public propertyValues: CustomerPropertyValues;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.requests = new CustomerRequests(transport, scope);
    this.propertyValues = new CustomerPropertyValues(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<CustomerField, "all"> & keyof Customer>(
    params: ListCustomersParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Customer, F | "id">>>;
  list(params?: ListCustomersParams): Promise<Page<Customer>>;
  list(params?: ListCustomersParams): Promise<Page<Customer>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every customer, following pages automatically. */
  iterate(params?: ListCustomersParams): AsyncGenerator<Customer> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<CustomerField, "all"> & keyof Customer>(
    customerId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Customer, F | "id">>;
  retrieve(customerId: string, params?: { fields?: readonly CustomerField[] }): Promise<Customer>;
  retrieve(customerId: string, params?: { fields?: readonly CustomerField[] }): Promise<Customer> {
    return this.doRetrieve({ pk: customerId }, params as Record<string, unknown>);
  }

  /** The one customer with this name; throws if none or several match. */
  findByName(name: string): Promise<Customer> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateCustomer): Promise<Customer> {
    return this.doCreate(data, {});
  }

  update(customerId: string, data: UpdateCustomer): Promise<Customer> {
    return this.doUpdate(data, { pk: customerId });
  }

  delete(customerId: string): Promise<void> {
    return this.doDelete({ pk: customerId });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(data: CreateCustomer): Promise<Customer> {
    return this.doUpsert(data, {});
  }

  /** Bulk add/remove work items linked directly to this customer. Invalid/archived ids are silently skipped. */
  async manageWorkItems(
    customerId: string,
    data: CustomerWorkItemManageRequest
  ): Promise<CustomerWorkItemManageResponse> {
    return this.transport.request<CustomerWorkItemManageResponse>(
      "POST",
      `${this.detailUrl({ pk: customerId })}work-items/`,
      { data }
    );
  }
}

export { CustomerPropertyValues } from "./PropertyValues";
export { CustomerRequests } from "./Requests";
export type { ListCustomerRequestsParams, CustomerRequestField, CustomerRequestOrderBy } from "./Requests";
