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
  /**
   * CustomerRequests with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly requests: Owned<CustomerRequests, CustomerIds>;
  /**
   * CustomerPropertyValues with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly propertyValues: Owned<CustomerPropertyValues, CustomerIds>;
  /**
   * CustomerWorkItems with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItems: Owned<CustomerWorkItems, CustomerIds>;
}

/** A fetched customer row that is also the place its children live. */
export type LoadedCustomerRow<TRow> = Loaded<TRow, CustomerNavigation>;

export type LoadedCustomer = LoadedCustomerRow<Customer>;
