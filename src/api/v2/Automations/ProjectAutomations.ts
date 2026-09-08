import {
  Automation,
  UpdateAutomation,
  AutomationStatus,
  SetAutomationStatus,
  CreateAutomation,
} from "../../../models/v2/Automation";
import { Page } from "../../../models/v2/common";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { AUTOMATION_ID_NAMES, AutomationNavigation, LoadedAutomation, LoadedAutomationRow } from "../loaded/Automation";
import { ProjectAutomationActivities } from "./ProjectAutomationActivities";
import { ProjectAutomationEdges } from "./ProjectAutomationEdges";
import { ProjectAutomationNodes } from "./ProjectAutomationNodes";

export type ProjectAutomationField = (typeof FIELDS)["project_automations_list"][number];
export type ProjectAutomationOrderBy = (typeof ORDER_BY)["project_automations_list"][number];

export interface ListProjectAutomationsParams {
  fields?: readonly ProjectAutomationField[];
  name?: string;
  scope?: string;
  status?: AutomationStatus | string;
  is_enabled?: boolean;
  is_global?: boolean;
  search?: string;
  order_by?: ProjectAutomationOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface ProjectAutomationShapeParams {
  fields?: readonly ProjectAutomationField[];
}

/** Automations scoped to one project — CRUD, `status`, and sub-resources `nodes`/`edges`/`activities`. */
export class ProjectAutomations extends LoadsNavigableRows<
  Automation,
  CreateAutomation,
  UpdateAutomation,
  AutomationNavigation
> {
  protected path = "/workspaces/{slug}/projects/{project_id}/automations/";
  protected extraPaths = {
    // `status` is the URL segment, `setStatus` the method and the `operations` key.
    setStatus: "/workspaces/{slug}/projects/{project_id}/automations/{automation_id}/status/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "project_automations_list",
    retrieve: "project_automations_retrieve",
    create: "project_automations_create",
    update: "project_automations_partial_update",
    delete: "project_automations_destroy",
    setStatus: "project_automations_status",
  };
  protected loadedIdNames = AUTOMATION_ID_NAMES;

  public nodes: ProjectAutomationNodes;
  public edges: ProjectAutomationEdges;
  public activities: ProjectAutomationActivities;

  constructor(transport: V2Transport) {
    super(transport);
    this.nodes = new ProjectAutomationNodes(transport);
    this.edges = new ProjectAutomationEdges(transport);
    this.activities = new ProjectAutomationActivities(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<AutomationNavigation> {
    const ids = meta.ids as [string, string, string];
    return {
      nodes: () => owned(this.nodes, ids, meta.idNames),
      edges: () => owned(this.edges, ids, meta.idNames),
      activities: () => owned(this.activities, ids, meta.idNames),
    };
  }

  private _at(slug: string, project: string, automation?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project };
    if (automation !== undefined) params.pk = automation;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectAutomationField, "all"> & keyof Automation>(
    slug: string,
    project: string,
    params: ListProjectAutomationsParams & { fields: readonly F[] }
  ): Promise<Page<LoadedAutomationRow<Pick<Automation, F | "id">>>>;
  list(slug: string, project: string, params?: ListProjectAutomationsParams): Promise<Page<LoadedAutomation>>;
  async list(slug: string, project: string, params?: ListProjectAutomationsParams): Promise<Page<LoadedAutomation>> {
    const page = await this.doList(this._at(slug, project), params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every automation in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<ProjectAutomationField, "all"> & keyof Automation>(
    slug: string,
    project: string,
    params: Omit<ListProjectAutomationsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedAutomationRow<Pick<Automation, F | "id">>>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListProjectAutomationsParams, "offset" | "count">
  ): AsyncGenerator<LoadedAutomation>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListProjectAutomationsParams, "offset" | "count">
  ): AsyncGenerator<LoadedAutomation> {
    return this.loadIterate(
      this.doIterate(this._at(slug, project), params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<ProjectAutomationField, "all"> & keyof Automation>(
    slug: string,
    project: string,
    automation: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedAutomationRow<Pick<Automation, F | "id">>>;
  retrieve(
    slug: string,
    project: string,
    automation: string,
    params?: ProjectAutomationShapeParams
  ): Promise<LoadedAutomation>;
  async retrieve(
    slug: string,
    project: string,
    automation: string,
    params?: ProjectAutomationShapeParams
  ): Promise<LoadedAutomation> {
    const row = await this.doRetrieve(this._at(slug, project, automation), params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  /** The one automation with this name; throws if none or several match. */
  async findByName(slug: string, project: string, name: string): Promise<LoadedAutomation> {
    const row = await this.doFindOne({ name }, this._at(slug, project));
    return this.load(row, [slug, project]);
  }

  create<F extends Exclude<ProjectAutomationField, "all"> & keyof Automation>(
    slug: string,
    project: string,
    data: CreateAutomation,
    params: ProjectAutomationShapeParams & { fields: readonly F[] }
  ): Promise<LoadedAutomationRow<Pick<Automation, F | "id">>>;
  create(
    slug: string,
    project: string,
    data: CreateAutomation,
    params?: ProjectAutomationShapeParams
  ): Promise<LoadedAutomation>;
  async create(
    slug: string,
    project: string,
    data: CreateAutomation,
    params?: ProjectAutomationShapeParams
  ): Promise<LoadedAutomation> {
    const row = await this.doCreate(data, this._at(slug, project), params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<ProjectAutomationField, "all"> & keyof Automation>(
    slug: string,
    project: string,
    automation: string,
    data: UpdateAutomation,
    params: ProjectAutomationShapeParams & { fields: readonly F[] }
  ): Promise<LoadedAutomationRow<Pick<Automation, F | "id">>>;
  update(
    slug: string,
    project: string,
    automation: string,
    data: UpdateAutomation,
    params?: ProjectAutomationShapeParams
  ): Promise<LoadedAutomation>;
  async update(
    slug: string,
    project: string,
    automation: string,
    data: UpdateAutomation,
    params?: ProjectAutomationShapeParams
  ): Promise<LoadedAutomation> {
    const row = await this.doUpdate(data, this._at(slug, project, automation), params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, automation: string): Promise<void> {
    return this.doDelete(this._at(slug, project, automation));
  }

  /** Enable/disable the automation — the only way to flip `is_enabled`/`status`. */
  async setStatus(slug: string, project: string, automation: string, data: SetAutomationStatus): Promise<void> {
    await this.doCustomAction<void>("setStatus", {
      method: "POST",
      pathParams: { slug, project_id: project, automation_id: automation },
      data,
    });
  }
}
