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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface GroupSyncProjectMappingFieldsParams {
  fields?: readonly GroupSyncProjectMappingField[];
}

/**
 * IdP group -> project(s) + role mappings for SSO/SCIM sync. No upsert or bulk write.
 *
 * **Workspace-level despite the name.** Its path is
 * `/workspaces/{slug}/group-sync/project-mappings/` — there is no `{project_id}` in it,
 * so every method here takes `slug` alone. The projects a group maps to are fields on
 * the row, not part of the URL.
 */
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
    slug: string,
    params: ListGroupSyncProjectMappingsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<GroupMapping, F | "id">>>;
  list(slug: string, params?: ListGroupSyncProjectMappingsParams): Promise<Page<GroupMapping>>;
  list(slug: string, params?: ListGroupSyncProjectMappingsParams): Promise<Page<GroupMapping>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every mapping, following pages automatically. */
  iterate<F extends Exclude<GroupSyncProjectMappingField, "all"> & keyof GroupMapping>(
    slug: string,
    params: Omit<ListGroupSyncProjectMappingsParams, "offset" | "count"> & {
      fields: readonly F[];
    }
  ): AsyncGenerator<Pick<GroupMapping, F | "id">>;
  iterate(
    slug: string,
    params?: Omit<ListGroupSyncProjectMappingsParams, "offset" | "count">
  ): AsyncGenerator<GroupMapping>;
  iterate(
    slug: string,
    params?: Omit<ListGroupSyncProjectMappingsParams, "offset" | "count">
  ): AsyncGenerator<GroupMapping> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<GroupSyncProjectMappingField, "all"> & keyof GroupMapping>(
    slug: string,
    mapping: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<GroupMapping, F | "id">>;
  retrieve(slug: string, mapping: string, params?: GroupSyncProjectMappingFieldsParams): Promise<GroupMapping>;
  retrieve(slug: string, mapping: string, params?: GroupSyncProjectMappingFieldsParams): Promise<GroupMapping> {
    return this.doRetrieve({ slug, pk: mapping }, params as Record<string, unknown>);
  }

  create<F extends Exclude<GroupSyncProjectMappingField, "all"> & keyof GroupMapping>(
    slug: string,
    data: CreateGroupMapping,
    params: GroupSyncProjectMappingFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<GroupMapping, F | "id">>;
  create(slug: string, data: CreateGroupMapping, params?: GroupSyncProjectMappingFieldsParams): Promise<GroupMapping>;
  create(slug: string, data: CreateGroupMapping, params?: GroupSyncProjectMappingFieldsParams): Promise<GroupMapping> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update<F extends Exclude<GroupSyncProjectMappingField, "all"> & keyof GroupMapping>(
    slug: string,
    mapping: string,
    data: UpdateGroupMapping,
    params: GroupSyncProjectMappingFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<GroupMapping, F | "id">>;
  update(
    slug: string,
    mapping: string,
    data: UpdateGroupMapping,
    params?: GroupSyncProjectMappingFieldsParams
  ): Promise<GroupMapping>;
  update(
    slug: string,
    mapping: string,
    data: UpdateGroupMapping,
    params?: GroupSyncProjectMappingFieldsParams
  ): Promise<GroupMapping> {
    return this.doUpdate(data, { slug, pk: mapping }, params as Record<string, unknown>);
  }

  delete(slug: string, mapping: string): Promise<void> {
    return this.doDelete({ slug, pk: mapping });
  }
}
