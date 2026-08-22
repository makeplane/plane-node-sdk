import {
  AttachedWorkItemTypeProperties,
  WorkItemType,
  UpdateWorkItemType,
  WorkItemTypeSchema,
  CreateWorkItemType,
} from "../../../models/v2/WorkItemType";
import { Page } from "../../../models/v2/common";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { WorkItemTypeProperties } from "./Properties";

export type WorkItemTypeField = (typeof FIELDS)["work_item_types_list"][number];
export type WorkItemTypeOrderBy = (typeof ORDER_BY)["work_item_types_list"][number];

/** Shared with `WorkspaceWorkItemTypes` — both ops have identical `fields`/`order_by` enums. */
export interface ListWorkItemTypesParams {
  fields?: readonly WorkItemTypeField[];
  name?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: WorkItemTypeOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Project-scoped work item types; `schema`/`enable`/`import` exist only here. `properties` attaches, doesn't define. */
export class WorkItemTypes extends V2Resource<WorkItemType, CreateWorkItemType, UpdateWorkItemType> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-item-types/";
  protected operations: Record<string, AnyOperationId> = {
    list: "work_item_types_list",
    retrieve: "work_item_types_retrieve",
    create: "work_item_types_create",
    update: "work_item_types_partial_update",
    enable: "work_item_types_enable",
    "mark-default": "work_item_types_mark_default",
    delete: "work_item_types_destroy",
    import: "work_item_types_import",
    schema: "work_item_types_schema",
  };

  /** The custom properties attached to a type. */
  public properties: WorkItemTypeProperties;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.properties = new WorkItemTypeProperties(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    params: ListWorkItemTypesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemType, F | "id">>>;
  list(params?: ListWorkItemTypesParams): Promise<Page<WorkItemType>>;
  list(params?: ListWorkItemTypesParams): Promise<Page<WorkItemType>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every work item type in the project, following pages automatically. */
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

  /** The one type with this name; throws if none or several match. */
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

  /** Mark this type as the project's default. Returns the updated row. */
  markDefault(typeId: string, params?: { fields?: readonly WorkItemTypeField[] }): Promise<WorkItemType> {
    return this.doAction<WorkItemType>("mark-default", { pk: typeId }, params as Record<string, unknown>);
  }

  /** The type's writable fields + custom properties as a form would render them; `include` inlines extra option lists. */
  async schema(typeId: string, params?: { include?: string }): Promise<WorkItemTypeSchema> {
    return this.transport.request<WorkItemTypeSchema>("GET", `${this.detailUrl({ pk: typeId })}schema/`, {
      params: this.query(params as Record<string, unknown> | undefined, "schema"),
    });
  }

  /** Enable the project's Epic type (idempotent). Collection-level action, so hand-built rather than `doAction`. */
  async enable(params?: { fields?: readonly WorkItemTypeField[] }): Promise<WorkItemType> {
    return this.transport.request<WorkItemType>("POST", `${this.collectionUrl({})}enable/`, {
      params: this.query(params as Record<string, unknown>, "enable"),
    });
  }

  /** Import given workspace-level types into this project as project-scoped copies. No response body. */
  async import(workItemTypeIds: string[]): Promise<void> {
    await this.transport.request<void>("POST", `${this.collectionUrl({})}import/`, {
      data: { work_item_types: workItemTypeIds },
    });
  }
}

export { WorkItemTypeProperties } from "./Properties";
export type {
  ListWorkItemTypePropertiesParams,
  WorkItemTypePropertyField,
  WorkItemTypePropertyOrderBy,
} from "./Properties";
export type { AttachedWorkItemTypeProperties };
