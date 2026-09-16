/** A webhook delivery log entry (upstream `WebhookEvent`; `WebhookLog` is deprecated naming). Read-only. */
export interface WebhookLog {
  id: string;
  webhook_id?: string;
  event_type?: string;
  request_method?: string | null;
  request_headers?: string | null;
  request_body?: string | null;
  response_status?: string | null;
  response_headers?: string | null;
  response_body?: string | null;
  status_text?: string;
  error_message?: string;
  /** Round-trip time in milliseconds. */
  duration_ms?: number | null;
  retry_count?: number;
  created_at?: string;
}
