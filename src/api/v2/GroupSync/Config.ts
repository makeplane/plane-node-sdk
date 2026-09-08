import { GroupSyncConfig, UpdateGroupSyncConfig } from "../../../models/v2/GroupSyncConfig";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/**
 * The workspace's IdP group-sync configuration.
 *
 * A **singleton**: GET/PATCH against the collection URL, no primary key of its own, so
 * both verbs go through the kernel's singleton helpers.
 */
export class GroupSyncConfigResource extends V2Resource<GroupSyncConfig, never, UpdateGroupSyncConfig> {
  protected path = "/workspaces/{slug}/group-sync/config/";
  // No entry needed: this operation takes no `fields`/`order_by`/`expand`.
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "group_sync_config_retrieve",
    update: "group_sync_config_update",
  };

  /**
   * The workspace's group-sync configuration.
   *
   * Spelled `retrieve`, not `get`, like every other singleton read in the SDK
   * (`features.retrieve`, `permissions.me`, `releases.changelog.retrieve`) and like the
   * Python SDK. One verb per shape of call, whether or not the route has a primary key.
   */
  retrieve(slug: string): Promise<GroupSyncConfig> {
    return this.doRetrieveSingleton<GroupSyncConfig>({ slug }, "retrieve");
  }

  update(slug: string, data: UpdateGroupSyncConfig): Promise<GroupSyncConfig> {
    return this.doUpdateSingleton<GroupSyncConfig>(data, { slug });
  }
}
