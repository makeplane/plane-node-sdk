import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Work-item membership of a release, reached flat as `v2.workspaces.releases.workItems.add(slug, release, ids)`, or from a fetched release as `release.workItems.add(ids)`. 1..100 ids per call; resolves to the ids actually changed. */
export class ReleaseWorkItems extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/releases/{release_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    // One operation, two verbs — see `CycleWorkItems.operations`.
    add: "releases_work_items",
    remove: "releases_work_items",
  };

  /** Add work items to the release; already-present ids are omitted from the result. */
  add(slug: string, release: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", workItemIds, { slug, release_id: release });
  }

  /** Remove work items from the release; ids not in it are skipped. */
  remove(slug: string, release: string, workItemIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", workItemIds, { slug, release_id: release });
  }
}
