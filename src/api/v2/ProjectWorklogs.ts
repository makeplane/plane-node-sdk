import { WorklogSummaryEntry } from "../../models/v2/WorklogSummary";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/**
 * Per-work-item logged-time totals for a project.
 *
 * A single read-only report, not a paginated collection: the response is a **bare JSON
 * array**, one row per work item, with no `Page<T>` envelope around it — so it goes
 * through the kernel's custom-action helper, typed to the array, rather than `doList`.
 * The golden declares no `?fields=` on this operation.
 */
export class ProjectWorklogs extends V2Resource<WorklogSummaryEntry, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/worklogs/summary/";
  protected operations: Record<string, AnyOperationId> = {
    summary: "project_worklogs_summary",
  };

  summary(slug: string, project: string): Promise<WorklogSummaryEntry[]> {
    return this.doCustomAction<WorklogSummaryEntry[]>("summary", {
      method: "GET",
      pathParams: { slug, project_id: project },
    });
  }
}
