export type WebhookContentType = "application/json" | "application/x-www-form-urlencoded";

/** A workspace webhook. `secret_key` is never present here — returned once from `create`/`regenerate`, see {@link WebhookCreateResponse}. */
export interface Webhook {
  id: string;
  content_type?: WebhookContentType;
  created_at?: string;
  created_by_id?: string | null;
  is_active?: boolean;
  name?: string | null;
  scopes?: string[];
  url?: string;
  version?: string;
}

/** POST body. `url` is required in practice for create (server rejects one without it); {@link UpdateWebhook} makes it optional. */
export interface CreateWebhook {
  url: string;
  content_type?: WebhookContentType;
  is_active?: boolean;
  name?: string | null;
  scopes?: string[];
  version?: string;
}

/** PATCH body — every field optional, including `url`. v2 has no PUT. */
export type UpdateWebhook = Partial<CreateWebhook>;

/** Create/regenerate response — includes `secret_key` once. Never returned from list/retrieve/update. */
export interface WebhookCreateResponse extends Webhook {
  secret_key?: string;
}
