import { Page } from "../../models/v2/common";
import { AuditLog, AuditLogCategory, AuditLogOutcome } from "../../models/v2/AuditLog";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type AuditLogField = (typeof FIELDS)["audit_logs_list"][number];
export type AuditLogOrderBy = (typeof ORDER_BY)["audit_logs_list"][number];

export interface ListAuditLogsParams {
  fields?: readonly AuditLogField[];
  actor_id?: string;
  category?: AuditLogCategory;
  outcome?: AuditLogOutcome;
  event_name?: string;
  ip_address?: string;
  project_id?: string;
  target_id?: string;
  target_type?: string;
  created_after?: string;
  created_before?: string;
  search?: string;
  order_by?: AuditLogOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read. */
export interface AuditLogFieldsParams {
  fields?: readonly AuditLogField[];
}

/** Workspace audit logs. Read-only, cursor- or offset-paginated. */
export class AuditLogs extends V2Resource<AuditLog, never, never> {
  protected path = "/workspaces/{slug}/audit-logs/";
  protected operations: Record<string, OperationId> = {
    list: "audit_logs_list",
    retrieve: "audit_logs_retrieve",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<AuditLogField, "all"> & keyof AuditLog>(
    slug: string,
    params: ListAuditLogsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AuditLog, F | "id">>>;
  list(slug: string, params?: ListAuditLogsParams): Promise<Page<AuditLog>>;
  list(slug: string, params?: ListAuditLogsParams): Promise<Page<AuditLog>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every audit log entry, following pages automatically. */
  iterate<F extends Exclude<AuditLogField, "all"> & keyof AuditLog>(
    slug: string,
    params: ListAuditLogsParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<AuditLog, F | "id">>;
  iterate(slug: string, params?: ListAuditLogsParams): AsyncGenerator<AuditLog>;
  iterate(slug: string, params?: ListAuditLogsParams): AsyncGenerator<AuditLog> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<AuditLogField, "all"> & keyof AuditLog>(
    slug: string,
    log: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AuditLog, F | "id">>;
  retrieve(slug: string, log: string, params?: AuditLogFieldsParams): Promise<AuditLog>;
  retrieve(slug: string, log: string, params?: AuditLogFieldsParams): Promise<AuditLog> {
    return this.doRetrieve({ slug, pk: log }, params as Record<string, unknown>);
  }
}
