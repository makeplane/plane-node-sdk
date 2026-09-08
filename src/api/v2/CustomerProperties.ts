import { Page } from "../../models/v2/common";
import {
  CustomerProperty,
  UpdateCustomerProperty,
  CustomerPropertyType,
  CreateCustomerProperty,
} from "../../models/v2/CustomerProperty";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type CustomerPropertyField = (typeof FIELDS)["customer_properties_list"][number];
export type CustomerPropertyOrderBy = (typeof ORDER_BY)["customer_properties_list"][number];

export interface ListCustomerPropertiesParams {
  fields?: readonly CustomerPropertyField[];
  name?: string;
  is_active?: boolean;
  is_required?: boolean;
  property_type?: CustomerPropertyType;
  search?: string;
  order_by?: CustomerPropertyOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface CustomerPropertyFieldsParams {
  fields?: readonly CustomerPropertyField[];
}

/** Custom properties on a workspace's customers. Workspace-scoped, and unrelated to work-item properties. */
export class CustomerProperties extends V2Resource<CustomerProperty, CreateCustomerProperty, UpdateCustomerProperty> {
  protected path = "/workspaces/{slug}/customer-properties/";
  protected operations: Record<string, OperationId> = {
    list: "customer_properties_list",
    retrieve: "customer_properties_retrieve",
    create: "customer_properties_create",
    update: "customer_properties_partial_update",
    delete: "customer_properties_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<CustomerPropertyField, "all"> & keyof CustomerProperty>(
    slug: string,
    params: ListCustomerPropertiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<CustomerProperty, F | "id">>>;
  list(slug: string, params?: ListCustomerPropertiesParams): Promise<Page<CustomerProperty>>;
  list(slug: string, params?: ListCustomerPropertiesParams): Promise<Page<CustomerProperty>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every customer property, following pages automatically. */
  iterate<F extends Exclude<CustomerPropertyField, "all"> & keyof CustomerProperty>(
    slug: string,
    params: ListCustomerPropertiesParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<CustomerProperty, F | "id">>;
  iterate(slug: string, params?: ListCustomerPropertiesParams): AsyncGenerator<CustomerProperty>;
  iterate(slug: string, params?: ListCustomerPropertiesParams): AsyncGenerator<CustomerProperty> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<CustomerPropertyField, "all"> & keyof CustomerProperty>(
    slug: string,
    property: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<CustomerProperty, F | "id">>;
  retrieve(slug: string, property: string, params?: CustomerPropertyFieldsParams): Promise<CustomerProperty>;
  retrieve(slug: string, property: string, params?: CustomerPropertyFieldsParams): Promise<CustomerProperty> {
    return this.doRetrieve({ slug, pk: property }, params as Record<string, unknown>);
  }

  /** The one customer property with this `name` (the slugified key, not the display label); throws if none or several match. */
  findByName(slug: string, name: string): Promise<CustomerProperty> {
    return this.doFindOne({ name }, { slug });
  }

  create(slug: string, data: CreateCustomerProperty, params?: CustomerPropertyFieldsParams): Promise<CustomerProperty> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update(
    slug: string,
    property: string,
    data: UpdateCustomerProperty,
    params?: CustomerPropertyFieldsParams
  ): Promise<CustomerProperty> {
    return this.doUpdate(data, { slug, pk: property }, params as Record<string, unknown>);
  }

  delete(slug: string, property: string): Promise<void> {
    return this.doDelete({ slug, pk: property });
  }
}
