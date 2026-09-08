import {
  AttachedWorkItemTypeProperties,
  WorkItemType,
  UpdateWorkItemType,
  WorkItemTypeSchema,
  CreateWorkItemType,
} from "../../../models/v2/WorkItemType";
import { Page } from "../../../models/v2/common";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import {
  LoadedWorkItemType,
  LoadedWorkItemTypeRow,
  WORK_ITEM_TYPE_ID_NAMES,
  WorkItemTypeNavigation,
} from "../loaded/WorkItemType";
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

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkItemTypeShapeParams {
  fields?: readonly WorkItemTypeField[];
}

/**
 * Project-scoped work item types; `schema`/`enable`/`import` exist only here.
 *
 * Reached flat — `v2.workspaces.projects.workItemTypes.list(slug, project)` — or from a fetched
 * project: `project.workItemTypes.list()`. Every row-returning method answers a
 * {@link LoadedWorkItemType}, so `type.properties.link([...])` repeats no id. `properties`
 * attaches the link/unlink resource; the definitions themselves live on
 * `WorkItemProperties`.
 */
export class WorkItemTypes extends LoadsNavigableRows<
  WorkItemType,
  CreateWorkItemType,
  UpdateWorkItemType,
  WorkItemTypeNavigation
> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-item-types/";
  protected extraPaths = {
    // The API spells this verb with a hyphen while the method is `markDefault`, and the
    // `operations` key has to be the method name (`operations-coverage.test.ts`). A
    // template override carries the spelling so neither has to bend.
    markDefault: "/workspaces/{slug}/projects/{project_id}/work-item-types/{type_id}/mark-default/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "work_item_types_list",
    retrieve: "work_item_types_retrieve",
    create: "work_item_types_create",
    update: "work_item_types_partial_update",
    enable: "work_item_types_enable",
    markDefault: "work_item_types_mark_default",
    delete: "work_item_types_destroy",
    import: "work_item_types_import",
    schema: "work_item_types_schema",
  };
  protected loadedIdNames = WORK_ITEM_TYPE_ID_NAMES;

  /** The custom properties attached to a type. */
  public properties: WorkItemTypeProperties;

  constructor(transport: V2Transport) {
    super(transport);
    this.properties = new WorkItemTypeProperties(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WorkItemTypeNavigation> {
    const ids = meta.ids as [string, string, string];
    return { properties: () => owned(this.properties, ids, meta.idNames) };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    project: string,
    params: ListWorkItemTypesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedWorkItemTypeRow<Pick<WorkItemType, F | "id">>>>;
  list(slug: string, project: string, params?: ListWorkItemTypesParams): Promise<Page<LoadedWorkItemType>>;
  async list(slug: string, project: string, params?: ListWorkItemTypesParams): Promise<Page<LoadedWorkItemType>> {
    const page = await this.doList({ slug, project_id: project }, params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every work item type in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    project: string,
    params: ListWorkItemTypesParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  iterate(slug: string, project: string, params?: ListWorkItemTypesParams): AsyncGenerator<LoadedWorkItemType>;
  iterate(slug: string, project: string, params?: ListWorkItemTypesParams): AsyncGenerator<LoadedWorkItemType> {
    return this.loadIterate(
      this.doIterate({ slug, project_id: project }, params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    project: string,
    type: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  retrieve(slug: string, project: string, type: string, params?: WorkItemTypeShapeParams): Promise<LoadedWorkItemType>;
  async retrieve(
    slug: string,
    project: string,
    type: string,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkItemType> {
    const row = await this.doRetrieve({ slug, project_id: project, pk: type }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  /** The one type with this name; throws if none or several match. Answers the same navigable row `retrieve` does. */
  async findByName(slug: string, project: string, name: string): Promise<LoadedWorkItemType> {
    const row = await this.doFindOne({ name }, { slug, project_id: project });
    return this.load(row, [slug, project]);
  }

  create<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    project: string,
    data: CreateWorkItemType,
    params: WorkItemTypeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  create(
    slug: string,
    project: string,
    data: CreateWorkItemType,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkItemType>;
  async create(
    slug: string,
    project: string,
    data: CreateWorkItemType,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkItemType> {
    const row = await this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    project: string,
    type: string,
    data: UpdateWorkItemType,
    params: WorkItemTypeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  update(
    slug: string,
    project: string,
    type: string,
    data: UpdateWorkItemType,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkItemType>;
  async update(
    slug: string,
    project: string,
    type: string,
    data: UpdateWorkItemType,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkItemType> {
    const row = await this.doUpdate(data, { slug, project_id: project, pk: type }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, type: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: type });
  }

  /** Mark this type as the project's default. Answers the updated row, navigable. */
  markDefault<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    project: string,
    type: string,
    params: WorkItemTypeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  markDefault(
    slug: string,
    project: string,
    type: string,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkItemType>;
  async markDefault(
    slug: string,
    project: string,
    type: string,
    params?: WorkItemTypeShapeParams
  ): Promise<LoadedWorkItemType> {
    const row = await this.doCustomAction<WorkItemType>("markDefault", {
      method: "POST",
      pathParams: { slug, project_id: project, type_id: type },
      params: params as Record<string, unknown>,
    });
    return this.load(row, [slug, project], params?.fields);
  }

  /** The type's writable fields + custom properties as a form would render them; `include` inlines extra option lists. */
  schema(slug: string, project: string, type: string, params?: { include?: string }): Promise<WorkItemTypeSchema> {
    return this.doCustomAction<WorkItemTypeSchema>("schema", {
      method: "GET",
      pathParams: { slug, project_id: project },
      pk: type,
      params: params as Record<string, unknown>,
    });
  }

  /** Enable the project's Epic type (idempotent). A collection-level action, so it has no pk. */
  enable<F extends Exclude<WorkItemTypeField, "all"> & keyof WorkItemType>(
    slug: string,
    project: string,
    params: WorkItemTypeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemTypeRow<Pick<WorkItemType, F | "id">>>;
  enable(slug: string, project: string, params?: WorkItemTypeShapeParams): Promise<LoadedWorkItemType>;
  async enable(slug: string, project: string, params?: WorkItemTypeShapeParams): Promise<LoadedWorkItemType> {
    const row = await this.doCustomAction<WorkItemType>("enable", {
      method: "POST",
      pathParams: { slug, project_id: project },
      params: params as Record<string, unknown>,
      onCollection: true,
    });
    return this.load(row, [slug, project], params?.fields);
  }

  /** Import given workspace-level types into this project as project-scoped copies. No response body. */
  async import(slug: string, project: string, workItemTypeIds: string[]): Promise<void> {
    await this.doCustomAction<void>("import", {
      method: "POST",
      pathParams: { slug, project_id: project },
      data: { work_item_types: workItemTypeIds },
      onCollection: true,
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
