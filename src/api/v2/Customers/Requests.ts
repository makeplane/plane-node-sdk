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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface CustomerRequestShapeParams {
  fields?: readonly CustomerRequestField[];
}

/**
 * Requests raised by a customer.
 *
 * Reached flat — `v2.workspaces.customers.requests.list(slug, customer)` — or from a
 * fetched customer: `customer.requests.list()`.
 */
export class CustomerRequests extends V2Resource<CustomerRequest, CreateCustomerRequest, UpdateCustomerRequest> {
  protected path = "/workspaces/{slug}/customers/{customer_id}/requests/";
  protected operations: Record<string, OperationId> = {
    list: "customer_requests_list",
    retrieve: "customer_requests_retrieve",
    create: "customer_requests_create",
    update: "customer_requests_partial_update",
    delete: "customer_requests_destroy",
  };

  private _at(slug: string, customer: string, request?: string): Record<string, string> {
    const params: Record<string, string> = { slug, customer_id: customer };
    if (request !== undefined) params.pk = request;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<CustomerRequestField, "all"> & keyof CustomerRequest>(
    slug: string,
    customer: string,
    params: ListCustomerRequestsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<CustomerRequest, F | "id">>>;
  list(slug: string, customer: string, params?: ListCustomerRequestsParams): Promise<Page<CustomerRequest>>;
  list(slug: string, customer: string, params?: ListCustomerRequestsParams): Promise<Page<CustomerRequest>> {
    return this.doList(this._at(slug, customer), params as Record<string, unknown>);
  }

  /** Every request, following pages automatically. */
  iterate<F extends Exclude<CustomerRequestField, "all"> & keyof CustomerRequest>(
    slug: string,
    customer: string,
    params: Omit<ListCustomerRequestsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<CustomerRequest, F | "id">>;
  iterate(
    slug: string,
    customer: string,
    params?: Omit<ListCustomerRequestsParams, "offset" | "count">
  ): AsyncGenerator<CustomerRequest>;
  iterate(
    slug: string,
    customer: string,
    params?: Omit<ListCustomerRequestsParams, "offset" | "count">
  ): AsyncGenerator<CustomerRequest> {
    return this.doIterate(this._at(slug, customer), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<CustomerRequestField, "all"> & keyof CustomerRequest>(
    slug: string,
    customer: string,
    request: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<CustomerRequest, F | "id">>;
  retrieve(
    slug: string,
    customer: string,
    request: string,
    params?: { fields?: readonly CustomerRequestField[] }
  ): Promise<CustomerRequest>;
  retrieve(
    slug: string,
    customer: string,
    request: string,
    params?: { fields?: readonly CustomerRequestField[] }
  ): Promise<CustomerRequest> {
    return this.doRetrieve(this._at(slug, customer, request), params as Record<string, unknown>);
  }

  create<F extends Exclude<CustomerRequestField, "all"> & keyof CustomerRequest>(
    slug: string,
    customer: string,
    data: CreateCustomerRequest,
    params: CustomerRequestShapeParams & { fields: readonly F[] }
  ): Promise<Pick<CustomerRequest, F | "id">>;
  create(
    slug: string,
    customer: string,
    data: CreateCustomerRequest,
    params?: CustomerRequestShapeParams
  ): Promise<CustomerRequest>;
  create(
    slug: string,
    customer: string,
    data: CreateCustomerRequest,
    params?: CustomerRequestShapeParams
  ): Promise<CustomerRequest> {
    return this.doCreate(data, this._at(slug, customer), params as Record<string, unknown>);
  }

  update<F extends Exclude<CustomerRequestField, "all"> & keyof CustomerRequest>(
    slug: string,
    customer: string,
    request: string,
    data: UpdateCustomerRequest,
    params: CustomerRequestShapeParams & { fields: readonly F[] }
  ): Promise<Pick<CustomerRequest, F | "id">>;
  update(
    slug: string,
    customer: string,
    request: string,
    data: UpdateCustomerRequest,
    params?: CustomerRequestShapeParams
  ): Promise<CustomerRequest>;
  update(
    slug: string,
    customer: string,
    request: string,
    data: UpdateCustomerRequest,
    params?: CustomerRequestShapeParams
  ): Promise<CustomerRequest> {
    return this.doUpdate(data, this._at(slug, customer, request), params as Record<string, unknown>);
  }

  delete(slug: string, customer: string, request: string): Promise<void> {
    return this.doDelete(this._at(slug, customer, request));
  }
}
