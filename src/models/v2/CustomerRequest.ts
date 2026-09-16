/** A request raised by a customer, nested under it. Every field except `id` is optional. */
export interface CustomerRequest {
  id: string;
  customer_id?: string;
  name?: string;
  description?: unknown;
  /** Only present when `fields` names it explicitly — deferred on list. */
  description_html?: string | null;
  link?: string | null;
  archived_at?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required; `work_item_ids` links existing work items at creation, write-only. */
export interface CreateCustomerRequest {
  name: string;
  description?: unknown;
  description_html?: string | null;
  link?: string | null;
  work_item_ids?: string[];
}

/** PATCH body — every field optional. `work_item_ids` is accepted but ignored on update. */
export type UpdateCustomerRequest = Partial<CreateCustomerRequest>;
