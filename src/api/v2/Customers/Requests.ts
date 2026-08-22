import { Page } from "../../../models/v2/common";
import { CustomerRequest, UpdateCustomerRequest, CreateCustomerRequest } from "../../../models/v2/CustomerRequest";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type CustomerRequestField = (typeof FIELDS)["customer_requests_list"][number];
export type CustomerRequestOrderBy = (typeof ORDER_BY)["customer_requests_list"][number];

export interface ListCustomerRequestsParams {
  fields?: readonly CustomerRequestField[];
  search?: string;
  order_by?: CustomerRequestOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Requests raised by a customer, at `...customers.requests`. Nested under a customer via `customerId`. */
export class CustomerRequests extends V2Resource<CustomerRequest, CreateCustomerRequest, UpdateCustomerRequest> {
  protected path = "/workspaces/{slug}/customers/{customer_id}/requests/";
  protected operations: Record<string, OperationId> = {
    list: "customer_requests_list",
    retrieve: "customer_requests_retrieve",
    create: "customer_requests_create",
    update: "customer_requests_partial_update",
    delete: "customer_requests_destroy",
  };

  private pk(customerId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { customer_id: customerId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<CustomerRequestField, "all"> & keyof CustomerRequest>(
    customerId: string,
    params: ListCustomerRequestsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<CustomerRequest, F | "id">>>;
  list(customerId: string, params?: ListCustomerRequestsParams): Promise<Page<CustomerRequest>>;
  list(customerId: string, params?: ListCustomerRequestsParams): Promise<Page<CustomerRequest>> {
    return this.doList(this.pk(customerId), params as Record<string, unknown>);
  }

  /** Every request, following pages automatically. */
  iterate(customerId: string, params?: ListCustomerRequestsParams): AsyncGenerator<CustomerRequest> {
    return this.doIterate(this.pk(customerId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<CustomerRequestField, "all"> & keyof CustomerRequest>(
    customerId: string,
    requestId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<CustomerRequest, F | "id">>;
  retrieve(
    customerId: string,
    requestId: string,
    params?: { fields?: readonly CustomerRequestField[] }
  ): Promise<CustomerRequest>;
  retrieve(
    customerId: string,
    requestId: string,
    params?: { fields?: readonly CustomerRequestField[] }
  ): Promise<CustomerRequest> {
    return this.doRetrieve(this.pk(customerId, requestId), params as Record<string, unknown>);
  }

  create(customerId: string, data: CreateCustomerRequest): Promise<CustomerRequest> {
    return this.doCreate(data, this.pk(customerId));
  }

  update(customerId: string, requestId: string, data: UpdateCustomerRequest): Promise<CustomerRequest> {
    return this.doUpdate(data, this.pk(customerId, requestId));
  }

  delete(customerId: string, requestId: string): Promise<void> {
    return this.doDelete(this.pk(customerId, requestId));
  }
}
