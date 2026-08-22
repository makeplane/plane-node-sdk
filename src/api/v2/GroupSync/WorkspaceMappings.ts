import { Page } from "../../../models/v2/common";
import {
  WorkspaceGroupMapping,
  UpdateWorkspaceGroupMapping,
  CreateWorkspaceGroupMapping,
} from "../../../models/v2/WorkspaceGroupMapping";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type GroupSyncWorkspaceMappingField = (typeof FIELDS)["group_sync_workspace_mappings_list"][number];
export type GroupSyncWorkspaceMappingOrderBy = (typeof ORDER_BY)["group_sync_workspace_mappings_list"][number];

export interface ListGroupSyncWorkspaceMappingsParams {
  fields?: readonly GroupSyncWorkspaceMappingField[];
  search?: string;
  order_by?: GroupSyncWorkspaceMappingOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** IdP group -> workspace role mappings for SSO/SCIM sync. No upsert or bulk write. */
export class GroupSyncWorkspaceMappings extends V2Resource<
  WorkspaceGroupMapping,
  CreateWorkspaceGroupMapping,
  UpdateWorkspaceGroupMapping
> {
  protected path = "/workspaces/{slug}/group-sync/workspace-mappings/";
  protected operations: Record<string, OperationId> = {
    list: "group_sync_workspace_mappings_list",
    retrieve: "group_sync_workspace_mappings_retrieve",
    create: "group_sync_workspace_mappings_create",
    update: "group_sync_workspace_mappings_update",
    delete: "group_sync_workspace_mappings_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<GroupSyncWorkspaceMappingField, "all"> & keyof WorkspaceGroupMapping>(
    params: ListGroupSyncWorkspaceMappingsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkspaceGroupMapping, F | "id">>>;
  list(params?: ListGroupSyncWorkspaceMappingsParams): Promise<Page<WorkspaceGroupMapping>>;
  list(params?: ListGroupSyncWorkspaceMappingsParams): Promise<Page<WorkspaceGroupMapping>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every mapping, following pages automatically. */
  iterate(params?: ListGroupSyncWorkspaceMappingsParams): AsyncGenerator<WorkspaceGroupMapping> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<GroupSyncWorkspaceMappingField, "all"> & keyof WorkspaceGroupMapping>(
    mappingId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkspaceGroupMapping, F | "id">>;
  retrieve(
    mappingId: string,
    params?: { fields?: readonly GroupSyncWorkspaceMappingField[] }
  ): Promise<WorkspaceGroupMapping>;
  retrieve(
    mappingId: string,
    params?: { fields?: readonly GroupSyncWorkspaceMappingField[] }
  ): Promise<WorkspaceGroupMapping> {
    return this.doRetrieve({ pk: mappingId }, params as Record<string, unknown>);
  }

  create(data: CreateWorkspaceGroupMapping): Promise<WorkspaceGroupMapping> {
    return this.doCreate(data, {});
  }

  update(mappingId: string, data: UpdateWorkspaceGroupMapping): Promise<WorkspaceGroupMapping> {
    return this.doUpdate(data, { pk: mappingId });
  }

  delete(mappingId: string): Promise<void> {
    return this.doDelete({ pk: mappingId });
  }
}
