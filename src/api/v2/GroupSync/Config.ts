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
    get: "group_sync_config_retrieve",
    update: "group_sync_config_update",
  };

  get(slug: string): Promise<GroupSyncConfig> {
    return this.doRetrieveSingleton<GroupSyncConfig>({ slug }, "get");
  }

  update(slug: string, data: UpdateGroupSyncConfig): Promise<GroupSyncConfig> {
    return this.doUpdateSingleton<GroupSyncConfig>(data, { slug });
  }
}
