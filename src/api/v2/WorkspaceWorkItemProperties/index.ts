import { Page } from "../../../models/v2/common";
import { WorkItemProperty, UpdateWorkItemProperty, CreateWorkItemProperty } from "../../../models/v2/WorkItemProperty";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { OperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import {
  LoadedWorkspaceWorkItemProperty,
  LoadedWorkspaceWorkItemPropertyRow,
  WORKSPACE_WORK_ITEM_PROPERTY_ID_NAMES,
  WorkspaceWorkItemPropertyNavigation,
} from "../loaded/WorkItemProperty";
import { WorkItemPropertyContexts } from "./Contexts";
import { WorkspaceWorkItemPropertyOptions } from "./Options";

export type WorkspaceWorkItemPropertyField = (typeof FIELDS)["workspace_work_item_properties_list"][number];
export type WorkspaceWorkItemPropertyOrderBy = (typeof ORDER_BY)["workspace_work_item_properties_list"][number];

export interface ListWorkspaceWorkItemPropertiesParams {
  fields?: readonly WorkspaceWorkItemPropertyField[];
  name?: string;
  /** The label a user sees in the UI, as opposed to `name`, which is the server-derived slug. Case-insensitive exact match. */
  display_name?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: WorkspaceWorkItemPropertyOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkspaceWorkItemPropertyShapeParams {
  fields?: readonly WorkspaceWorkItemPropertyField[];
}

/**
 * Custom work item property definitions shared across the whole workspace, not owned by
 * one project.
 *
 * Reached flat — `v2.workspaces.workItemProperties.list(slug)` — or from a fetched
 * workspace: `workspace.workItemProperties.list()`. Every row-returning method answers a
 * {@link LoadedWorkspaceWorkItemProperty}, whose choices are reached as
 * `property.propertyOptions.list()` — **not** `options`, which is a real field on the row
 * (see `WorkspaceWorkItemPropertyNavigation`).
 */
export class WorkspaceWorkItemProperties extends LoadsNavigableRows<
  WorkItemProperty,
  CreateWorkItemProperty,
  UpdateWorkItemProperty,
  WorkspaceWorkItemPropertyNavigation
> {
  protected path = "/workspaces/{slug}/work-item-properties/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_work_item_properties_list",
    retrieve: "workspace_work_item_properties_retrieve",
    create: "workspace_work_item_properties_create",
    update: "workspace_work_item_properties_partial_update",
    delete: "workspace_work_item_properties_destroy",
  };
  protected loadedIdNames = WORKSPACE_WORK_ITEM_PROPERTY_ID_NAMES;

  /** Contexts scoping this property's applicability/default to projects and/or work item types. */
  public contexts: WorkItemPropertyContexts;
  /** Options of an OPTION-typed workspace property; reached from a row as `propertyOptions`. */
  public options: WorkspaceWorkItemPropertyOptions;

  constructor(transport: V2Transport) {
    super(transport);
    this.contexts = new WorkItemPropertyContexts(transport);
    this.options = new WorkspaceWorkItemPropertyOptions(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WorkspaceWorkItemPropertyNavigation> {
    const ids = meta.ids as [string, string];
    return {
      propertyOptions: () => owned(this.options, ids, meta.idNames),
      contexts: () => owned(this.contexts, ids, meta.idNames),
    };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceWorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    params: ListWorkspaceWorkItemPropertiesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedWorkspaceWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>>;
  list(slug: string, params?: ListWorkspaceWorkItemPropertiesParams): Promise<Page<LoadedWorkspaceWorkItemProperty>>;
  async list(
    slug: string,
    params?: ListWorkspaceWorkItemPropertiesParams
  ): Promise<Page<LoadedWorkspaceWorkItemProperty>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every workspace property, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<WorkspaceWorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    params: ListWorkspaceWorkItemPropertiesParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedWorkspaceWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>;
  iterate(
    slug: string,
    params?: ListWorkspaceWorkItemPropertiesParams
  ): AsyncGenerator<LoadedWorkspaceWorkItemProperty>;
  iterate(
    slug: string,
    params?: ListWorkspaceWorkItemPropertiesParams
  ): AsyncGenerator<LoadedWorkspaceWorkItemProperty> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<WorkspaceWorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    property: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedWorkspaceWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>;
  retrieve(
    slug: string,
    property: string,
    params?: WorkspaceWorkItemPropertyShapeParams
  ): Promise<LoadedWorkspaceWorkItemProperty>;
  async retrieve(
    slug: string,
    property: string,
    params?: WorkspaceWorkItemPropertyShapeParams
  ): Promise<LoadedWorkspaceWorkItemProperty> {
    const row = await this.doRetrieve({ slug, pk: property }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** The one property with this `name`, server-side via `?name=`. `name` is the property key (e.g. `story-points`, hyphen-slugified), not the UI label. */
  async findByName(slug: string, name: string): Promise<LoadedWorkspaceWorkItemProperty> {
    const row = await this.doFindOne({ name }, { slug });
    return this.load(row, [slug]);
  }

  /**
   * The one property with this display name, server-side via `?display_name=`; throws if
   * none or several match.
   *
   * `displayName` is the label a user sees in the UI — `name` is the slugified key the
   * server derives from it, so this is the lookup a person reaching for a property they
   * can see on screen actually wants. The match is case-insensitive.
   */
  async findByDisplayName(slug: string, displayName: string): Promise<LoadedWorkspaceWorkItemProperty> {
    const row = await this.doFindOne({ display_name: displayName }, { slug });
    return this.load(row, [slug]);
  }

  create<F extends Exclude<WorkspaceWorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    data: CreateWorkItemProperty,
    params: WorkspaceWorkItemPropertyShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkspaceWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>;
  create(
    slug: string,
    data: CreateWorkItemProperty,
    params?: WorkspaceWorkItemPropertyShapeParams
  ): Promise<LoadedWorkspaceWorkItemProperty>;
  async create(
    slug: string,
    data: CreateWorkItemProperty,
    params?: WorkspaceWorkItemPropertyShapeParams
  ): Promise<LoadedWorkspaceWorkItemProperty> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  update<F extends Exclude<WorkspaceWorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    property: string,
    data: UpdateWorkItemProperty,
    params: WorkspaceWorkItemPropertyShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkspaceWorkItemPropertyRow<Pick<WorkItemProperty, F | "id">>>;
  update(
    slug: string,
    property: string,
    data: UpdateWorkItemProperty,
    params?: WorkspaceWorkItemPropertyShapeParams
  ): Promise<LoadedWorkspaceWorkItemProperty>;
  async update(
    slug: string,
    property: string,
    data: UpdateWorkItemProperty,
    params?: WorkspaceWorkItemPropertyShapeParams
  ): Promise<LoadedWorkspaceWorkItemProperty> {
    const row = await this.doUpdate(data, { slug, pk: property }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  delete(slug: string, property: string): Promise<void> {
    return this.doDelete({ slug, pk: property });
  }
}

export { WorkItemPropertyContexts } from "./Contexts";
export { WorkspaceWorkItemPropertyOptions } from "./Options";
export type {
  ListWorkItemPropertyContextsParams,
  WorkItemPropertyContextOrderBy,
  WorkItemPropertyContextShapeParams,
} from "./Contexts";
export type { ListWorkspaceWorkItemPropertyOptionsParams, WorkspaceWorkItemPropertyOptionOrderBy } from "./Options";
