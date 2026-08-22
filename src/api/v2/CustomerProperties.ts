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

/** Custom properties on a workspace's customers, at `...customerProperties`. Workspace-scoped, unrelated to work-item properties. */
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
    params: ListCustomerPropertiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<CustomerProperty, F | "id">>>;
  list(params?: ListCustomerPropertiesParams): Promise<Page<CustomerProperty>>;
  list(params?: ListCustomerPropertiesParams): Promise<Page<CustomerProperty>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every customer property, following pages automatically. */
  iterate(params?: ListCustomerPropertiesParams): AsyncGenerator<CustomerProperty> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<CustomerPropertyField, "all"> & keyof CustomerProperty>(
    propertyId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<CustomerProperty, F | "id">>;
  retrieve(propertyId: string, params?: { fields?: readonly CustomerPropertyField[] }): Promise<CustomerProperty>;
  retrieve(propertyId: string, params?: { fields?: readonly CustomerPropertyField[] }): Promise<CustomerProperty> {
    return this.doRetrieve({ pk: propertyId }, params as Record<string, unknown>);
  }

  /** The one customer property with this name; throws if none or several match. */
  findByName(name: string): Promise<CustomerProperty> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateCustomerProperty): Promise<CustomerProperty> {
    return this.doCreate(data, {});
  }

  update(propertyId: string, data: UpdateCustomerProperty): Promise<CustomerProperty> {
    return this.doUpdate(data, { pk: propertyId });
  }

  delete(propertyId: string): Promise<void> {
    return this.doDelete({ pk: propertyId });
  }
}
