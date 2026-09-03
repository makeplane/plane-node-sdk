import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work-item membership of a release, at `ws.releases.workItems`. 1..100 ids per call; resolves to the ids actually changed. */
export class ReleaseWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/releases/{release_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    manage: "releases_work_items",
  };

  /** Add work items to the release; already-present ids are omitted from the result. */
  add(releaseId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { release_id: releaseId });
  }

  /** Remove work items from the release; ids not in it are skipped. */
  remove(releaseId: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { release_id: releaseId });
  }
}
