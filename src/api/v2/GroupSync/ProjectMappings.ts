import { Page } from "../../../models/v2/common";
import { GroupMapping, UpdateGroupMapping, CreateGroupMapping } from "../../../models/v2/GroupMapping";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type GroupSyncProjectMappingField = (typeof FIELDS)["group_sync_project_mappings_list"][number];
export type GroupSyncProjectMappingOrderBy = (typeof ORDER_BY)["group_sync_project_mappings_list"][number];

export interface ListGroupSyncProjectMappingsParams {
  fields?: readonly GroupSyncProjectMappingField[];
  search?: string;
  order_by?: GroupSyncProjectMappingOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** IdP group -> project(s) + role mappings for SSO/SCIM sync. No upsert or bulk write. */
export class GroupSyncProjectMappings extends V2Resource<GroupMapping, CreateGroupMapping, UpdateGroupMapping> {
  protected path = "/workspaces/{slug}/group-sync/project-mappings/";
  protected operations: Record<string, OperationId> = {
    list: "group_sync_project_mappings_list",
    retrieve: "group_sync_project_mappings_retrieve",
    create: "group_sync_project_mappings_create",
    update: "group_sync_project_mappings_update",
    delete: "group_sync_project_mappings_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<GroupSyncProjectMappingField, "all"> & keyof GroupMapping>(
    params: ListGroupSyncProjectMappingsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<GroupMapping, F | "id">>>;
  list(params?: ListGroupSyncProjectMappingsParams): Promise<Page<GroupMapping>>;
  list(params?: ListGroupSyncProjectMappingsParams): Promise<Page<GroupMapping>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every mapping, following pages automatically. */
  iterate(params?: ListGroupSyncProjectMappingsParams): AsyncGenerator<GroupMapping> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<GroupSyncProjectMappingField, "all"> & keyof GroupMapping>(
    mappingId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<GroupMapping, F | "id">>;
  retrieve(mappingId: string, params?: { fields?: readonly GroupSyncProjectMappingField[] }): Promise<GroupMapping>;
  retrieve(mappingId: string, params?: { fields?: readonly GroupSyncProjectMappingField[] }): Promise<GroupMapping> {
    return this.doRetrieve({ pk: mappingId }, params as Record<string, unknown>);
  }

  create(data: CreateGroupMapping): Promise<GroupMapping> {
    return this.doCreate(data, {});
  }

  update(mappingId: string, data: UpdateGroupMapping): Promise<GroupMapping> {
    return this.doUpdate(data, { pk: mappingId });
  }

  delete(mappingId: string): Promise<void> {
    return this.doDelete({ pk: mappingId });
  }
}
