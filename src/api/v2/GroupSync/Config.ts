import { GroupSyncConfig, UpdateGroupSyncConfig } from "../../../models/v2/GroupSyncConfig";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Singleton workspace IdP group-sync config. GET/PATCH only; talks to the singleton URL directly, bypassing `doRetrieve`/`doUpdate`. */
export class GroupSyncConfigResource extends V2Resource<GroupSyncConfig, never, UpdateGroupSyncConfig> {
  protected path = "/workspaces/{slug}/group-sync/config/";
  // No entry needed: this operation takes no `fields`/`order_by`/`expand`.
  protected operations: Record<string, AnyOperationId> = {
    get: "group_sync_config_retrieve",
    update: "group_sync_config_update",
  };

  // `async` is required: `urlFor` throws synchronously, and a non-async method
  // returning the transport promise directly would let that escape as a throw.
  async get(): Promise<GroupSyncConfig> {
    return this.transport.request<GroupSyncConfig>("GET", this.urlFor("get", {}));
  }

  async update(data: UpdateGroupSyncConfig): Promise<GroupSyncConfig> {
    return this.transport.request<GroupSyncConfig>("PATCH", this.urlFor("update", {}), { data });
  }
}
