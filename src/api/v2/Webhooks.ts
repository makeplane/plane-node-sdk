import { Page } from "../../models/v2/common";
import { Webhook, WebhookCreateResponse, UpdateWebhook, CreateWebhook } from "../../models/v2/Webhook";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";
import { V2Transport } from "./kernel/transport";
import { WebhookLogs } from "./WebhookLogs";

export type WebhookField = (typeof FIELDS)["webhooks_list"][number];
export type WebhookOrderBy = (typeof ORDER_BY)["webhooks_list"][number];

export interface ListWebhooksParams {
  fields?: readonly WebhookField[];
  is_active?: boolean;
  name?: string;
  search?: string;
  url?: string;
  order_by?: WebhookOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/**
 * Workspace webhooks; only `create`/`regenerate` return `secret_key`; `.logs` exposes one webhook's delivery history.
 */
export class Webhooks extends V2Resource<Webhook, CreateWebhook, UpdateWebhook> {
  protected path = "/workspaces/{slug}/webhooks/";
  protected operations: Record<string, OperationId> = {
    list: "webhooks_list",
    retrieve: "webhooks_retrieve",
    create: "webhooks_create",
    update: "webhooks_partial_update",
    regenerate: "webhooks_regenerate",
    delete: "webhooks_destroy",
  };

  public logs: WebhookLogs;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.logs = new WebhookLogs(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WebhookField, "all"> & keyof Webhook>(
    params: ListWebhooksParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Webhook, F | "id">>>;
  list(params?: ListWebhooksParams): Promise<Page<Webhook>>;
  list(params?: ListWebhooksParams): Promise<Page<Webhook>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every webhook in the workspace, following pages automatically. */
  iterate(params?: ListWebhooksParams): AsyncGenerator<Webhook> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WebhookField, "all"> & keyof Webhook>(
    webhookId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Webhook, F | "id">>;
  retrieve(webhookId: string, params?: { fields?: readonly WebhookField[] }): Promise<Webhook>;
  retrieve(webhookId: string, params?: { fields?: readonly WebhookField[] }): Promise<Webhook> {
    return this.doRetrieve({ pk: webhookId }, params as Record<string, unknown>);
  }

  /** The one webhook with this name; throws if none or several match. */
  findByName(name: string): Promise<Webhook> {
    return this.doFindOne({ name }, {});
  }

  /** Returns `secret_key` once — store it now, it is never shown again outside of `regenerate`. */
  create(data: CreateWebhook, params?: { fields?: readonly WebhookField[] }): Promise<WebhookCreateResponse> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(webhookId: string, data: UpdateWebhook, params?: { fields?: readonly WebhookField[] }): Promise<Webhook> {
    return this.doUpdate(data, { pk: webhookId }, params as Record<string, unknown>);
  }

  delete(webhookId: string): Promise<void> {
    return this.doDelete({ pk: webhookId });
  }

  /** Issue a new `secret_key`, invalidating the old one. Returns it once, like `create`. */
  regenerate(webhookId: string, params?: { fields?: readonly WebhookField[] }): Promise<WebhookCreateResponse> {
    return this.doAction<WebhookCreateResponse>("regenerate", { pk: webhookId }, params as Record<string, unknown>);
  }
}
