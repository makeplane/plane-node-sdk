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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface GroupSyncWorkspaceMappingFieldsParams {
  fields?: readonly GroupSyncWorkspaceMappingField[];
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
    slug: string,
    params: ListGroupSyncWorkspaceMappingsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkspaceGroupMapping, F | "id">>>;
  list(slug: string, params?: ListGroupSyncWorkspaceMappingsParams): Promise<Page<WorkspaceGroupMapping>>;
  list(slug: string, params?: ListGroupSyncWorkspaceMappingsParams): Promise<Page<WorkspaceGroupMapping>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every mapping, following pages automatically. */
  iterate<F extends Exclude<GroupSyncWorkspaceMappingField, "all"> & keyof WorkspaceGroupMapping>(
    slug: string,
    params: Omit<ListGroupSyncWorkspaceMappingsParams, "offset" | "count"> & {
      fields: readonly F[];
    }
  ): AsyncGenerator<Pick<WorkspaceGroupMapping, F | "id">>;
  iterate(
    slug: string,
    params?: Omit<ListGroupSyncWorkspaceMappingsParams, "offset" | "count">
  ): AsyncGenerator<WorkspaceGroupMapping>;
  iterate(
    slug: string,
    params?: Omit<ListGroupSyncWorkspaceMappingsParams, "offset" | "count">
  ): AsyncGenerator<WorkspaceGroupMapping> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<GroupSyncWorkspaceMappingField, "all"> & keyof WorkspaceGroupMapping>(
    slug: string,
    mapping: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkspaceGroupMapping, F | "id">>;
  retrieve(
    slug: string,
    mapping: string,
    params?: GroupSyncWorkspaceMappingFieldsParams
  ): Promise<WorkspaceGroupMapping>;
  retrieve(
    slug: string,
    mapping: string,
    params?: GroupSyncWorkspaceMappingFieldsParams
  ): Promise<WorkspaceGroupMapping> {
    return this.doRetrieve({ slug, pk: mapping }, params as Record<string, unknown>);
  }

  create<F extends Exclude<GroupSyncWorkspaceMappingField, "all"> & keyof WorkspaceGroupMapping>(
    slug: string,
    data: CreateWorkspaceGroupMapping,
    params: GroupSyncWorkspaceMappingFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkspaceGroupMapping, F | "id">>;
  create(
    slug: string,
    data: CreateWorkspaceGroupMapping,
    params?: GroupSyncWorkspaceMappingFieldsParams
  ): Promise<WorkspaceGroupMapping>;
  create(
    slug: string,
    data: CreateWorkspaceGroupMapping,
    params?: GroupSyncWorkspaceMappingFieldsParams
  ): Promise<WorkspaceGroupMapping> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update<F extends Exclude<GroupSyncWorkspaceMappingField, "all"> & keyof WorkspaceGroupMapping>(
    slug: string,
    mapping: string,
    data: UpdateWorkspaceGroupMapping,
    params: GroupSyncWorkspaceMappingFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkspaceGroupMapping, F | "id">>;
  update(
    slug: string,
    mapping: string,
    data: UpdateWorkspaceGroupMapping,
    params?: GroupSyncWorkspaceMappingFieldsParams
  ): Promise<WorkspaceGroupMapping>;
  update(
    slug: string,
    mapping: string,
    data: UpdateWorkspaceGroupMapping,
    params?: GroupSyncWorkspaceMappingFieldsParams
  ): Promise<WorkspaceGroupMapping> {
    return this.doUpdate(data, { slug, pk: mapping }, params as Record<string, unknown>);
  }

  delete(slug: string, mapping: string): Promise<void> {
    return this.doDelete({ slug, pk: mapping });
  }
}
