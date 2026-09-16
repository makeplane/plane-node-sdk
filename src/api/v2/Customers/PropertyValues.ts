import { CustomerPropertyValuesMap, CreateCustomerPropertyValues } from "../../../models/v2/CustomerPropertyValue";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Bulk customer property values, reached flat as `v2.workspaces.customers.propertyValues.list(slug, customer)`, or from a fetched customer as `customer.propertyValues.list()`. `list` returns `{property_id: [value, ...]}`. */
export class CustomerPropertyValues extends V2Resource<CustomerPropertyValuesMap, CreateCustomerPropertyValues, never> {
  protected path = "/workspaces/{slug}/customers/{customer_id}/property-values/";
  protected operations: Record<string, AnyOperationId> = {
    list: "customer_property_values_list",
    create: "customer_property_values_create",
  };

  /** `{property_id: [value, ...]}` for this customer's active properties with stored values. */
  list(slug: string, customer: string): Promise<CustomerPropertyValuesMap> {
    return this.doCustomAction<CustomerPropertyValuesMap>("list", {
      method: "GET",
      pathParams: { slug, customer_id: customer },
    });
  }

  /** Bulk-set: only the property ids present in `data.values` are replaced. */
  async create(slug: string, customer: string, data: CreateCustomerPropertyValues): Promise<void> {
    await this.doCustomAction<void>("create", {
      method: "POST",
      pathParams: { slug, customer_id: customer },
      data,
    });
  }
}
