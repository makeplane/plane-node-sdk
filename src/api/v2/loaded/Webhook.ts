import type { Webhook } from "../../../models/v2/Webhook";
import type { Loaded, Owned } from "../kernel/loaded";
import type { WebhookLogs } from "../WebhookLogs";

/** The path ids a child of a webhook row needs, in URL order. Webhooks are workspace-scoped. */
export type WebhookIds = [slug: string, webhook: string];

/** The parameter names behind {@link WebhookIds}, in the same order. */
export const WEBHOOK_ID_NAMES = ["slug", "webhook"] as const;

/**
 * Everything a fetched webhook can reach: its delivery history.
 *
 * `WebhookLogs` takes the webhook's id in its *collection* path
 * (`/webhook-logs/{webhook_id}/`) rather than on a detail route, so both ids bind exactly
 * as they do for any other child.
 */
export interface WebhookNavigation {
  /**
   * WebhookLogs with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly logs: Owned<WebhookLogs, WebhookIds>;
}

/** A fetched webhook row that is also the place its delivery log lives. */
export type LoadedWebhookRow<TRow> = Loaded<TRow, WebhookNavigation>;

export type LoadedWebhook = LoadedWebhookRow<Webhook>;
