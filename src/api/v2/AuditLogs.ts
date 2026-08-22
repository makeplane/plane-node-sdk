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

/** Audit logs (api_v2), workspace-scoped, at `client.v2.workspace(slug).auditLogs`. Read-only. */
export class AuditLogs extends V2Resource<AuditLog, never, never> {
  protected path = "/workspaces/{slug}/audit-logs/";
  protected operations: Record<string, OperationId> = {
    list: "audit_logs_list",
    retrieve: "audit_logs_retrieve",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<AuditLogField, "all"> & keyof AuditLog>(
    params: ListAuditLogsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AuditLog, F | "id">>>;
  list(params?: ListAuditLogsParams): Promise<Page<AuditLog>>;
  list(params?: ListAuditLogsParams): Promise<Page<AuditLog>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every audit log entry, following pages automatically. */
  iterate(params?: ListAuditLogsParams): AsyncGenerator<AuditLog> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<AuditLogField, "all"> & keyof AuditLog>(
    auditLogId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AuditLog, F | "id">>;
  retrieve(auditLogId: string, params?: { fields?: readonly AuditLogField[] }): Promise<AuditLog>;
  retrieve(auditLogId: string, params?: { fields?: readonly AuditLogField[] }): Promise<AuditLog> {
    return this.doRetrieve({ pk: auditLogId }, params as Record<string, unknown>);
  }
}
