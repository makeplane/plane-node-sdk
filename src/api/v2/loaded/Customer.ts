import type { Customer } from "../../../models/v2/Customer";
import type { CustomerPropertyValues } from "../Customers/PropertyValues";
import type { CustomerRequests } from "../Customers/Requests";
import type { CustomerWorkItems } from "../Customers/WorkItems";
import type { Loaded, Owned } from "../kernel/loaded";

/** The path ids a child of a customer row needs, in URL order. Customers are workspace-scoped. */
export type CustomerIds = [slug: string, customer: string];

/** The parameter names behind {@link CustomerIds}, in the same order. */
export const CUSTOMER_ID_NAMES = ["slug", "customer"] as const;

/** Everything a fetched customer can reach: its requests, its property values, its linked work items. */
export interface CustomerNavigation {
  readonly requests: Owned<CustomerRequests, CustomerIds>;
  readonly propertyValues: Owned<CustomerPropertyValues, CustomerIds>;
  readonly workItems: Owned<CustomerWorkItems, CustomerIds>;
}

/** A fetched customer row that is also the place its children live. */
export type LoadedCustomerRow<TRow> = Loaded<TRow, CustomerNavigation>;

export type LoadedCustomer = LoadedCustomerRow<Customer>;
