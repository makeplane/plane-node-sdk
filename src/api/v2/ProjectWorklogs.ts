import { WorklogSummaryEntry } from "../../models/v2/WorklogSummary";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/** Per-work-item logged-time totals for a project; response is a bare array, not a `Page<T>` envelope. */
export class ProjectWorklogs extends V2Resource<WorklogSummaryEntry, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/worklogs/summary/";
  protected operations: Record<string, AnyOperationId> = {
    summary: "project_worklogs_summary",
  };

  async summary(): Promise<WorklogSummaryEntry[]> {
    return this.transport.request<WorklogSummaryEntry[]>("GET", this.collectionUrl({}));
  }
}
