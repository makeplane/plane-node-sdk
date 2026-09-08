import { Page } from "../../models/v2/common";
import { WebhookLog } from "../../models/v2/WebhookLog";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type WebhookLogField = (typeof FIELDS)["webhook_logs_list"][number];
export type WebhookLogOrderBy = (typeof ORDER_BY)["webhook_logs_list"][number];

export interface ListWebhookLogsParams {
  fields?: readonly WebhookLogField[];
  order_by?: WebhookLogOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read. */
export interface WebhookLogFieldsParams {
  fields?: readonly WebhookLogField[];
}

/**
 * Read-only webhook delivery logs for one webhook; backed by `WebhookEvent` (the
 * `WebhookLog` model is deprecated upstream).
 *
 * The webhook's id sits in the **collection** path
 * (`.../webhook-logs/{webhook_id}/`), not on a detail route, so it is a leading path id
 * on `list` as well as on `retrieve` — and a log's own id is appended after it.
 */
export class WebhookLogs extends V2Resource<WebhookLog, never, never> {
  protected path = "/workspaces/{slug}/webhook-logs/{webhook_id}/";
  protected operations: Record<string, OperationId> = {
    list: "webhook_logs_list",
    retrieve: "webhook_logs_retrieve",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WebhookLogField, "all"> & keyof WebhookLog>(
    slug: string,
    webhook: string,
    params: ListWebhookLogsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WebhookLog, F | "id">>>;
  list(slug: string, webhook: string, params?: ListWebhookLogsParams): Promise<Page<WebhookLog>>;
  list(slug: string, webhook: string, params?: ListWebhookLogsParams): Promise<Page<WebhookLog>> {
    return this.doList({ slug, webhook_id: webhook }, params as Record<string, unknown>);
  }

  /** Every delivery log for this webhook, following pages automatically. */
  iterate<F extends Exclude<WebhookLogField, "all"> & keyof WebhookLog>(
    slug: string,
    webhook: string,
    params: Omit<ListWebhookLogsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WebhookLog, F | "id">>;
  iterate(
    slug: string,
    webhook: string,
    params?: Omit<ListWebhookLogsParams, "offset" | "count">
  ): AsyncGenerator<WebhookLog>;
  iterate(
    slug: string,
    webhook: string,
    params?: Omit<ListWebhookLogsParams, "offset" | "count">
  ): AsyncGenerator<WebhookLog> {
    return this.doIterate({ slug, webhook_id: webhook }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WebhookLogField, "all"> & keyof WebhookLog>(
    slug: string,
    webhook: string,
    log: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WebhookLog, F | "id">>;
  retrieve(slug: string, webhook: string, log: string, params?: WebhookLogFieldsParams): Promise<WebhookLog>;
  retrieve(slug: string, webhook: string, log: string, params?: WebhookLogFieldsParams): Promise<WebhookLog> {
    return this.doRetrieve({ slug, webhook_id: webhook, pk: log }, params as Record<string, unknown>);
  }
}
