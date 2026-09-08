import { Page } from "../../models/v2/common";
import { Webhook, WebhookCreateResponse, UpdateWebhook, CreateWebhook } from "../../models/v2/Webhook";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "./kernel/loaded";
import { OperationId } from "./kernel/resource";
import { V2Transport } from "./kernel/transport";
import { WEBHOOK_ID_NAMES, LoadedWebhook, LoadedWebhookRow, WebhookNavigation } from "./loaded/Webhook";
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
export class Webhooks extends LoadsNavigableRows<Webhook, CreateWebhook, UpdateWebhook, WebhookNavigation> {
  protected path = "/workspaces/{slug}/webhooks/";
  protected operations: Record<string, OperationId> = {
    list: "webhooks_list",
    retrieve: "webhooks_retrieve",
    create: "webhooks_create",
    update: "webhooks_partial_update",
    regenerate: "webhooks_regenerate",
    delete: "webhooks_destroy",
  };
  protected loadedIdNames = WEBHOOK_ID_NAMES;

  public logs: WebhookLogs;

  constructor(transport: V2Transport) {
    super(transport);
    this.logs = new WebhookLogs(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WebhookNavigation> {
    const ids = meta.ids as [string, string];
    return {
      logs: () => owned(this.logs, ids, meta.idNames),
    };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WebhookField, "all"> & keyof Webhook>(
    slug: string,
    params: ListWebhooksParams & { fields: readonly F[] }
  ): Promise<Page<LoadedWebhookRow<Pick<Webhook, F | "id">>>>;
  list(slug: string, params?: ListWebhooksParams): Promise<Page<LoadedWebhook>>;
  async list(slug: string, params?: ListWebhooksParams): Promise<Page<LoadedWebhook>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every webhook in the workspace, following pages automatically. */
  iterate<F extends Exclude<WebhookField, "all"> & keyof Webhook>(
    slug: string,
    params: ListWebhooksParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedWebhookRow<Pick<Webhook, F | "id">>>;
  iterate(slug: string, params?: ListWebhooksParams): AsyncGenerator<LoadedWebhook>;
  iterate(slug: string, params?: ListWebhooksParams): AsyncGenerator<LoadedWebhook> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<WebhookField, "all"> & keyof Webhook>(
    slug: string,
    webhook: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedWebhookRow<Pick<Webhook, F | "id">>>;
  retrieve(slug: string, webhook: string, params?: { fields?: readonly WebhookField[] }): Promise<LoadedWebhook>;
  async retrieve(slug: string, webhook: string, params?: { fields?: readonly WebhookField[] }): Promise<LoadedWebhook> {
    const row = await this.doRetrieve({ slug, pk: webhook }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** The one webhook with this name; throws if none or several match. */
  async findByName(slug: string, name: string): Promise<LoadedWebhook> {
    const row = await this.doFindOne({ name }, { slug });
    return this.load(row, [slug]);
  }

  /** Returns `secret_key` once — store it now, it is never shown again outside of `regenerate`. */
  create<F extends Exclude<WebhookField, "all"> & keyof WebhookCreateResponse>(
    slug: string,
    data: CreateWebhook,
    params: { fields: readonly F[] }
  ): Promise<Pick<WebhookCreateResponse, F | "id">>;
  create(
    slug: string,
    data: CreateWebhook,
    params?: { fields?: readonly WebhookField[] }
  ): Promise<WebhookCreateResponse>;
  create(
    slug: string,
    data: CreateWebhook,
    params?: { fields?: readonly WebhookField[] }
  ): Promise<WebhookCreateResponse> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update<F extends Exclude<WebhookField, "all"> & keyof Webhook>(
    slug: string,
    webhook: string,
    data: UpdateWebhook,
    params: { fields: readonly F[] }
  ): Promise<LoadedWebhookRow<Pick<Webhook, F | "id">>>;
  update(
    slug: string,
    webhook: string,
    data: UpdateWebhook,
    params?: { fields?: readonly WebhookField[] }
  ): Promise<LoadedWebhook>;
  async update(
    slug: string,
    webhook: string,
    data: UpdateWebhook,
    params?: { fields?: readonly WebhookField[] }
  ): Promise<LoadedWebhook> {
    const row = await this.doUpdate(data, { slug, pk: webhook }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  delete(slug: string, webhook: string): Promise<void> {
    return this.doDelete({ slug, pk: webhook });
  }

  /**
   * Issue a new `secret_key`, invalidating the old one. Returns it once, like `create`.
   *
   * **No `fields` option, deliberately.** `webhooks_regenerate` is the one operation whose
   * projectable field list includes `secret_key`, so a `fields` that omitted it would ask
   * the server to withhold the only copy of a secret that is never shown again —
   * irrecoverable, and silent. `create` keeps its `fields` because the golden does not let
   * `secret_key` be projected there. Recorded in `ONE_TIME_RESPONSES` in
   * `tests/unit/v2/fields-coverage.test.ts`.
   */
  regenerate(slug: string, webhook: string): Promise<WebhookCreateResponse> {
    return this.doAction<WebhookCreateResponse>("regenerate", { slug, pk: webhook });
  }
}
