import { Page } from "../../../models/v2/common";
import { WorkItemProperty, UpdateWorkItemProperty, CreateWorkItemProperty } from "../../../models/v2/WorkItemProperty";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { OperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import {
  LoadedWorkItemProperty,
  LoadedWorkItemPropertyRow,
  WORK_ITEM_PROPERTY_ID_NAMES,
  WorkItemPropertyNavigation,
} from "../loaded/WorkItemProperty";
import { WorkItemPropertyOptions } from "./Options";

export type WorkItemPropertyField = (typeof FIELDS)["work_item_properties_list"][number];
export type WorkItemPropertyOrderBy = (typeof ORDER_BY)["work_item_properties_list"][number];

export interface ListWorkItemPropertiesParams {
  fields?: readonly WorkItemPropertyField[];
  name?: string;
  /** The label a user sees in the UI, as opposed to `name`, which is the server-derived slug. Case-insensitive exact match. */
  display_name?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: WorkItemPropertyOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkItemPropertyShapeParams {
  fields?: readonly WorkItemPropertyField[];
}

/**
 * Custom work item property definitions scoped to a project; see
 * `WorkspaceWorkItemProperties` for the sibling.
 *
 * Reached flat — `v2.workspaces.projects.workItemProperties.list(slug, project)` — or from a fetched
 * project: `project.workItemProperties.list()`. Every row-returning method answers a
 * {@link LoadedWorkItemProperty}, whose choices are reached as
 * `property.propertyOptions.list()` — **not** `options`, which is a real field on the row
 * (see `WorkItemPropertyNavigation`).
 */
export class WorkItemProperties extends LoadsNavigableRows<
  WorkItemProperty,
  CreateWorkItemProperty,
  UpdateWorkItemProperty,
  WorkItemPropertyNavigation
> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-item-properties/";
  protected operations: Record<string, OperationId> = {
    list: "work_item_properties_list",
    retrieve: "work_item_properties_retrieve",
    create: "work_item_properties_create",
    update: "work_item_properties_partial_update",
    delete: "work_item_properties_destroy",
  };
  protected loadedIdNames = WORK_ITEM_PROPERTY_ID_NAMES;

  /** Options of an OPTION-typed property under this project; reached from a row as `propertyOptions`. */
  public options: WorkItemPropertyOptions;

  constructor(transport: V2Transport) {
    super(transport);
    this.options = new WorkItemPropertyOptions(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WorkItemPropertyNavigation> {
    const ids = meta.ids as [string, string, string];
    return { propertyOptions: () => owned(this.options, ids, meta.idNames) };
  }

  /**
   * One page of `WorkItemProperty` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    project: string,
    params: ListWorkItemPropertiesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>>;
  /** One page of `WorkItemProperty` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, project: string, params?: ListWorkItemPropertiesParams): Promise<Page<LoadedWorkItemProperty>>;
  async list(
    slug: string,
    project: string,
    params?: ListWorkItemPropertiesParams
  ): Promise<Page<LoadedWorkItemProperty>> {
    const page = await this.doList({ slug, project_id: project }, params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every property in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<WorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    project: string,
    params: Omit<ListWorkItemPropertiesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>;
  /** Every property in the project, following pages automatically — navigable rows included. */
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListWorkItemPropertiesParams, "offset" | "count">
  ): AsyncGenerator<LoadedWorkItemProperty>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListWorkItemPropertiesParams, "offset" | "count">
  ): AsyncGenerator<LoadedWorkItemProperty> {
    return this.loadIterate(
      this.doIterate({ slug, project_id: project }, params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<WorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    project: string,
    property: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>;
  retrieve(
    slug: string,
    project: string,
    property: string,
    params?: WorkItemPropertyShapeParams
  ): Promise<LoadedWorkItemProperty>;
  async retrieve(
    slug: string,
    project: string,
    property: string,
    params?: WorkItemPropertyShapeParams
  ): Promise<LoadedWorkItemProperty> {
    const row = await this.doRetrieve({ slug, project_id: project, pk: property }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  /** The one property with this `name`, server-side via `?name=`. `name` is the property key (e.g. `story-points`, hyphen-slugified), not the UI label. */
  async findByName(slug: string, project: string, name: string): Promise<LoadedWorkItemProperty> {
    const row = await this.doFindOne({ name }, { slug, project_id: project });
    return this.load(row, [slug, project]);
  }

  /**
   * The one property with this display name, server-side via `?display_name=`; throws if
   * none or several match.
   *
   * `displayName` is the label a user sees in the UI — `name` is the slugified key the
   * server derives from it, so this is the lookup a person reaching for a property they
   * can see on screen actually wants. The match is case-insensitive.
   */
  async findByDisplayName(slug: string, project: string, displayName: string): Promise<LoadedWorkItemProperty> {
    const row = await this.doFindOne({ display_name: displayName }, { slug, project_id: project });
    return this.load(row, [slug, project]);
  }

  create<F extends Exclude<WorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    project: string,
    data: CreateWorkItemProperty,
    params: WorkItemPropertyShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>;
  create(
    slug: string,
    project: string,
    data: CreateWorkItemProperty,
    params?: WorkItemPropertyShapeParams
  ): Promise<LoadedWorkItemProperty>;
  async create(
    slug: string,
    project: string,
    data: CreateWorkItemProperty,
    params?: WorkItemPropertyShapeParams
  ): Promise<LoadedWorkItemProperty> {
    const row = await this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<WorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    project: string,
    property: string,
    data: UpdateWorkItemProperty,
    params: WorkItemPropertyShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>;
  update(
    slug: string,
    project: string,
    property: string,
    data: UpdateWorkItemProperty,
    params?: WorkItemPropertyShapeParams
  ): Promise<LoadedWorkItemProperty>;
  async update(
    slug: string,
    project: string,
    property: string,
    data: UpdateWorkItemProperty,
    params?: WorkItemPropertyShapeParams
  ): Promise<LoadedWorkItemProperty> {
    const row = await this.doUpdate(
      data,
      { slug, project_id: project, pk: property },
      params as Record<string, unknown>
    );
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, property: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: property });
  }
}

export { WorkItemPropertyOptions } from "./Options";
export type { ListWorkItemPropertyOptionsParams, WorkItemPropertyOptionOrderBy } from "./Options";
