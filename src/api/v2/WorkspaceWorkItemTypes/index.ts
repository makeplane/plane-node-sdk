import { WorkItemType, UpdateWorkItemType, CreateWorkItemType } from "../../../models/v2/WorkItemType";
import { Page } from "../../../models/v2/common";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { ListWorkItemTypesParams, WorkItemTypeField } from "../WorkItemTypes";
import { WorkspaceWorkItemTypeProperties } from "./Properties";

/** Workspace-scoped work item types — a distinct resource from `WorkItemTypes`, not a filter on it. */
export class WorkspaceWorkItemTypes extends V2Resource<WorkItemType, CreateWorkItemType, UpdateWorkItemType> {
  protected path = "/workspaces/{slug}/work-item-types/";
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_work_item_types_list",
    retrieve: "workspace_work_item_types_retrieve",
    create: "workspace_work_item_types_create",
    update: "workspace_work_item_types_partial_update",
    delete: "workspace_work_item_types_destroy",
    "mark-default": "workspace_work_item_types_mark_default",
  };

  /** The custom properties attached to a workspace-scoped type. */
  public properties: WorkspaceWorkItemTypeProperties;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.properties = new WorkspaceWorkItemTypeProperties(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    params: ListWorkItemTypesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemType, F | "id">>>;
  list(params?: ListWorkItemTypesParams): Promise<Page<WorkItemType>>;
  list(params?: ListWorkItemTypesParams): Promise<Page<WorkItemType>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every work item type in the workspace, following pages automatically. */
  iterate(params?: ListWorkItemTypesParams): AsyncGenerator<WorkItemType> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    typeId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemType, F | "id">>;
  retrieve(typeId: string, params?: { fields?: readonly WorkItemTypeField[] }): Promise<WorkItemType>;
  retrieve(typeId: string, params?: { fields?: readonly WorkItemTypeField[] }): Promise<WorkItemType> {
    return this.doRetrieve({ pk: typeId }, params as Record<string, unknown>);
  }

  /** The one workspace-level type with this name; throws if none or several match. */
  findByName(name: string): Promise<WorkItemType> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateWorkItemType): Promise<WorkItemType> {
    return this.doCreate(data, {});
  }

  update(typeId: string, data: UpdateWorkItemType): Promise<WorkItemType> {
    return this.doUpdate(data, { pk: typeId });
  }

  delete(typeId: string): Promise<void> {
    return this.doDelete({ pk: typeId });
  }

  /** Mark this workspace-scoped type as the workspace's default. Returns the updated row. */
  markDefault(typeId: string, params?: { fields?: readonly WorkItemTypeField[] }): Promise<WorkItemType> {
    return this.doAction<WorkItemType>("mark-default", { pk: typeId }, params as Record<string, unknown>);
  }
}

export { WorkspaceWorkItemTypeProperties } from "./Properties";
