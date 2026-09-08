import { Page } from "../../models/v2/common";
import { WorkItem } from "../../models/v2/WorkItem";
import { WorkItemExpand, WorkItemField } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";
import { ListWorkItemsParams } from "./WorkItems";

const WORKSPACE_WORK_ITEM_BY_IDENTIFIER_PATH = "/workspaces/{slug}/work-items/{identifier}/";

/** Every work item across every project the caller can see; `list`/`retrieveByIdentifier` only — everything else stays on `Project.workItems`. */
export class WorkspaceWorkItems extends V2Resource<WorkItem, never, never> {
  protected path = "/workspaces/{slug}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_work_items_list",
    retrieveByIdentifier: "work_items_retrieve_by_identifier",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    params: ListWorkItemsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItem, F | "id">>>;
  list(params?: ListWorkItemsParams): Promise<Page<WorkItem>>;
  list(params?: ListWorkItemsParams): Promise<Page<WorkItem>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every work item in the workspace, following pages automatically. */
  iterate(params?: ListWorkItemsParams): AsyncGenerator<WorkItem> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  /** Look a work item up by its composite human key (`ENG-12`), not its id. */
  retrieveByIdentifier<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    identifier: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemExpand[] }
  ): Promise<Pick<WorkItem, F | "id">>;
  retrieveByIdentifier(
    identifier: string,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem>;
  retrieveByIdentifier(
    identifier: string,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem> {
    return this.doRetrieveAt(
      this.urlForTemplate(WORKSPACE_WORK_ITEM_BY_IDENTIFIER_PATH, "retrieveByIdentifier", { identifier }),
      "retrieveByIdentifier",
      params as Record<string, unknown>
    );
  }
}
