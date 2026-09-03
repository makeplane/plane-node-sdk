/** A workspace CRM customer. Every field except `id` is optional. */
export interface Customer {
  id: string;
  name?: string;
  description?: unknown;
  /** Only present when `fields` names it explicitly — deferred on list. */
  description_html?: string | null;
  email?: string | null;
  website_url?: string | null;
  logo_props?: unknown;
  logo_asset_id?: string | null;
  logo_url?: string | null;
  domain?: string | null;
  employees?: number | null;
  stage?: string | null;
  contract_status?: string | null;
  revenue?: string | null;
  external_source?: string | null;
  external_id?: string | null;
  archived_at?: string | null;
  customer_request_count?: number;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required by the API. */
export interface CreateCustomer {
  name: string;
  description?: unknown;
  description_html?: string | null;
  email?: string | null;
  website_url?: string | null;
  logo_props?: unknown;
  domain?: string | null;
  employees?: number | null;
  stage?: string | null;
  contract_status?: string | null;
  revenue?: string | null;
  external_source?: string | null;
  external_id?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateCustomer = Partial<CreateCustomer>;
