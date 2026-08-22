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
  count?: boolean;
}

/**
 * Read-only webhook delivery logs for one webhook; backed by `WebhookEvent` (the `WebhookLog` model is deprecated upstream).
 */
export class WebhookLogs extends V2Resource<WebhookLog, never, never> {
  protected path = "/workspaces/{slug}/webhook-logs/{webhook_id}/";
  protected operations: Record<string, OperationId> = {
    list: "webhook_logs_list",
    retrieve: "webhook_logs_retrieve",
  };

  private pk(webhookId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { webhook_id: webhookId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WebhookLogField, "all"> & keyof WebhookLog>(
    webhookId: string,
    params: ListWebhookLogsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WebhookLog, F | "id">>>;
  list(webhookId: string, params?: ListWebhookLogsParams): Promise<Page<WebhookLog>>;
  list(webhookId: string, params?: ListWebhookLogsParams): Promise<Page<WebhookLog>> {
    return this.doList(this.pk(webhookId), params as Record<string, unknown>);
  }

  /** Every delivery log for this webhook, following pages automatically. */
  iterate(webhookId: string, params?: ListWebhookLogsParams): AsyncGenerator<WebhookLog> {
    return this.doIterate(this.pk(webhookId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WebhookLogField, "all"> & keyof WebhookLog>(
    webhookId: string,
    logId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WebhookLog, F | "id">>;
  retrieve(webhookId: string, logId: string, params?: { fields?: readonly WebhookLogField[] }): Promise<WebhookLog>;
  retrieve(webhookId: string, logId: string, params?: { fields?: readonly WebhookLogField[] }): Promise<WebhookLog> {
    return this.doRetrieve(this.pk(webhookId, logId), params as Record<string, unknown>);
  }
}
