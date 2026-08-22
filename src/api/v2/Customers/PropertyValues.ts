import { CustomerPropertyValuesMap, CreateCustomerPropertyValues } from "../../../models/v2/CustomerPropertyValue";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Bulk customer property values, at `...customers.propertyValues`. `list` returns `{property_id: [value, ...]}`. */
export class CustomerPropertyValues extends V2Resource<CustomerPropertyValuesMap, CreateCustomerPropertyValues, never> {
  protected path = "/workspaces/{slug}/customers/{customer_id}/property-values/";
  protected operations: Record<string, AnyOperationId> = {
    list: "customer_property_values_list",
    create: "customer_property_values_create",
  };

  /** `{property_id: [value, ...]}` for this customer's active properties with stored values. */
  async list(customerId: string): Promise<CustomerPropertyValuesMap> {
    return this.transport.request<CustomerPropertyValuesMap>("GET", this.collectionUrl({ customer_id: customerId }));
  }

  /** Bulk-set: only the property ids present in `data.values` are replaced. */
  async create(customerId: string, data: CreateCustomerPropertyValues): Promise<void> {
    await this.transport.request<void>("POST", this.collectionUrl({ customer_id: customerId }), { data });
  }
}
