import { WorkItemType, UpdateWorkItemType, CreateWorkItemType } from "../../../models/v2/WorkItemType";
import { Page } from "../../../models/v2/common";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import {
  LoadedWorkspaceWorkItemType,
  LoadedWorkspaceWorkItemTypeRow,
  WORKSPACE_WORK_ITEM_TYPE_ID_NAMES,
  WorkspaceWorkItemTypeNavigation,
} from "../loaded/WorkItemType";
import { ListWorkItemTypesParams, WorkItemTypeField, WorkItemTypeShapeParams } from "../WorkItemTypes";
import { WorkspaceWorkItemTypeProperties } from "./Properties";

/**
 * Workspace-scoped work item types — a distinct resource from `WorkItemTypes`, not a
 * filter on it.
 *
 * Reached flat — `v2.workspaces.workItemTypes.list(slug)` — or from a fetched workspace:
 * `workspace.workItemTypes.list()`. Every row-returning method answers a
 * {@link LoadedWorkspaceWorkItemType}, so `type.properties.link([...])` repeats no id.
 */
export class WorkspaceWorkItemTypes extends LoadsNavigableRows<
  WorkItemType,
  CreateWorkItemType,
  UpdateWorkItemType,
  WorkspaceWorkItemTypeNavigation
> {
  protected path = "/workspaces/{slug}/work-item-types/";
  protected extraPaths = {
    // See `WorkItemTypes.extraPaths` — the API's hyphenated verb, the method's camelCase
    // name, and the `operations` key that must match the method.
    markDefault: "/workspaces/{slug}/work-item-types/{type_id}/mark-default/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_work_item_types_list",
    retrieve: "workspace_work_item_types_retrieve",
    create: "workspace_work_item_types_create",
    update: "workspace_work_item_types_partial_update",
    delete: "workspace_work_item_types_destroy",
    markDefault: "workspace_work_item_types_mark_default",
  };
  protected loadedIdNames = WORKSPACE_WORK_ITEM_TYPE_ID_NAMES;

  /** The custom properties attached to a workspace-scoped type. */
  public properties: WorkspaceWorkItemTypeProperties;

  constructor(transport: V2Transport) {
    super(transport);
    this.properties = new WorkspaceWorkItemTypeProperties(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WorkspaceWorkItemTypeNavigation> {
    const ids = meta.ids as [string, string];
    return { properties: () => owned(this.properties, ids, meta.idNames) };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    params: ListWorkItemTypesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedWorkspaceWorkItemTypeRow<Pick<WorkItemType, F | "id">>>>;
  list(slug: string, params?: ListWorkItemTypesParams): Promise<Page<LoadedWorkspaceWorkItemType>>;
  async list(slug: string, params?: ListWorkItemTypesParams): Promise<Page<LoadedWorkspaceWorkItemType>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every work item type in the workspace, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    params: Omit<ListWorkItemTypesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedWorkspaceWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  iterate(
    slug: string,
    params?: Omit<ListWorkItemTypesParams, "offset" | "count">
  ): AsyncGenerator<LoadedWorkspaceWorkItemType>;
  iterate(
    slug: string,
    params?: Omit<ListWorkItemTypesParams, "offset" | "count">
  ): AsyncGenerator<LoadedWorkspaceWorkItemType> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    type: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedWorkspaceWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  retrieve(slug: string, type: string, params?: WorkItemTypeShapeParams): Promise<LoadedWorkspaceWorkItemType>;
  async retrieve(slug: string, type: string, params?: WorkItemTypeShapeParams): Promise<LoadedWorkspaceWorkItemType> {
    const row = await this.doRetrieve({ slug, pk: type }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** The one workspace-level type with this name; throws if none or several match. */
  async findByName(slug: string, name: string): Promise<LoadedWorkspaceWorkItemType> {
    const row = await this.doFindOne({ name }, { slug });
    return this.load(row, [slug]);
  }

  create<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    data: CreateWorkItemType,
    params: WorkItemTypeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkspaceWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  create(
    slug: string,
    data: CreateWorkItemType,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkspaceWorkItemType>;
  async create(
    slug: string,
    data: CreateWorkItemType,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkspaceWorkItemType> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  update<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    type: string,
    data: UpdateWorkItemType,
    params: WorkItemTypeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkspaceWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  update(
    slug: string,
    type: string,
    data: UpdateWorkItemType,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkspaceWorkItemType>;
  async update(
    slug: string,
    type: string,
    data: UpdateWorkItemType,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkspaceWorkItemType> {
    const row = await this.doUpdate(data, { slug, pk: type }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  delete(slug: string, type: string): Promise<void> {
    return this.doDelete({ slug, pk: type });
  }

  /** Mark this workspace-scoped type as the workspace's default. Answers the updated row, navigable. */
  markDefault<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    type: string,
    params: WorkItemTypeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkspaceWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  markDefault(slug: string, type: string, params?: WorkItemTypeShapeParams): Promise<LoadedWorkspaceWorkItemType>;
  async markDefault(
    slug: string,
    type: string,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkspaceWorkItemType> {
    const row = await this.doCustomAction<WorkItemType>("markDefault", {
      method: "POST",
      pathParams: { slug, type_id: type },
      params: params as Record<string, unknown>,
    });
    return this.load(row, [slug], params?.fields);
  }
}

export { WorkspaceWorkItemTypeProperties } from "./Properties";
