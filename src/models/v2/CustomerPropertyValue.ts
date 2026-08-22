/** `{property_id: [value, ...]}` — active properties with at least one stored value. */
export type CustomerPropertyValuesMap = Record<string, string[]>;

/** `POST .../customers/{customer_id}/property-values/` body — only ids present in `values` are replaced. */
export interface CreateCustomerPropertyValues {
  values: Record<string, string[]>;
}
