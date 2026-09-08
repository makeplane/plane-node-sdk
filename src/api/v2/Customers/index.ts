import { Page } from "../../../models/v2/common";
import { Customer, UpdateCustomer, CreateCustomer } from "../../../models/v2/Customer";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { CUSTOMER_ID_NAMES, LoadedCustomer, LoadedCustomerRow, CustomerNavigation } from "../loaded/Customer";
import { CustomerPropertyValues } from "./PropertyValues";
import { CustomerRequests } from "./Requests";
import { CustomerWorkItems } from "./WorkItems";

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

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface CustomerShapeParams {
  fields?: readonly CustomerField[];
}

/** Workspace CRM customers, at `...customers` — CRUD, `upsert`, and sub-resources `requests`/`propertyValues`/`workItems`. */
export class Customers extends LoadsNavigableRows<Customer, CreateCustomer, UpdateCustomer, CustomerNavigation> {
  protected path = "/workspaces/{slug}/customers/";
  protected operations: Record<string, AnyOperationId> = {
    list: "customers_list",
    retrieve: "customers_retrieve",
    create: "customers_create",
    update: "customers_partial_update",
    upsert: "customers_upsert",
    delete: "customers_destroy",
  };
  protected loadedIdNames = CUSTOMER_ID_NAMES;

  public requests: CustomerRequests;
  public propertyValues: CustomerPropertyValues;
  /** `add`/`remove` work items linked to a customer — see {@link CustomerWorkItems}. */
  public workItems: CustomerWorkItems;

  constructor(transport: V2Transport) {
    super(transport);
    this.requests = new CustomerRequests(transport);
    this.propertyValues = new CustomerPropertyValues(transport);
    this.workItems = new CustomerWorkItems(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<CustomerNavigation> {
    const ids = meta.ids as [string, string];
    return {
      requests: () => owned(this.requests, ids, meta.idNames),
      propertyValues: () => owned(this.propertyValues, ids, meta.idNames),
      workItems: () => owned(this.workItems, ids, meta.idNames),
    };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<CustomerField, "all"> & keyof Customer>(
    slug: string,
    params: ListCustomersParams & { fields: readonly F[] }
  ): Promise<Page<LoadedCustomerRow<Pick<Customer, F | "id">>>>;
  list(slug: string, params?: ListCustomersParams): Promise<Page<LoadedCustomer>>;
  async list(slug: string, params?: ListCustomersParams): Promise<Page<LoadedCustomer>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every customer, following pages automatically. */
  iterate<F extends Exclude<CustomerField, "all"> & keyof Customer>(
    slug: string,
    params: ListCustomersParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedCustomerRow<Pick<Customer, F | "id">>>;
  iterate(slug: string, params?: ListCustomersParams): AsyncGenerator<LoadedCustomer>;
  iterate(slug: string, params?: ListCustomersParams): AsyncGenerator<LoadedCustomer> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<CustomerField, "all"> & keyof Customer>(
    slug: string,
    customer: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedCustomerRow<Pick<Customer, F | "id">>>;
  retrieve(slug: string, customer: string, params?: { fields?: readonly CustomerField[] }): Promise<LoadedCustomer>;
  async retrieve(
    slug: string,
    customer: string,
    params?: { fields?: readonly CustomerField[] }
  ): Promise<LoadedCustomer> {
    const row = await this.doRetrieve({ slug, pk: customer }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** The one customer with this name; throws if none or several match. */
  async findByName(slug: string, name: string): Promise<LoadedCustomer> {
    const row = await this.doFindOne({ name }, { slug });
    return this.load(row, [slug]);
  }

  async create(slug: string, data: CreateCustomer, params?: CustomerShapeParams): Promise<LoadedCustomer> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  async update(
    slug: string,
    customer: string,
    data: UpdateCustomer,
    params?: CustomerShapeParams
  ): Promise<LoadedCustomer> {
    const row = await this.doUpdate(data, { slug, pk: customer }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  delete(slug: string, customer: string): Promise<void> {
    return this.doDelete({ slug, pk: customer });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  async upsert(slug: string, data: CreateCustomer, params?: CustomerShapeParams): Promise<LoadedCustomer> {
    const row = await this.doUpsert(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }
}

export { CustomerPropertyValues } from "./PropertyValues";
export { CustomerWorkItems } from "./WorkItems";
export { CustomerRequests } from "./Requests";
export type { ListCustomerRequestsParams, CustomerRequestField, CustomerRequestOrderBy } from "./Requests";
