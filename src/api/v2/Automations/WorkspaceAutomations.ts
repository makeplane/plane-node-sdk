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
import {
  WORKSPACE_AUTOMATION_ID_NAMES,
  WorkspaceAutomationNavigation,
  LoadedWorkspaceAutomation,
  LoadedWorkspaceAutomationRow,
} from "../loaded/Automation";
import { WorkspaceAutomationActivities } from "./WorkspaceAutomationActivities";
import { WorkspaceAutomationEdges } from "./WorkspaceAutomationEdges";
import { WorkspaceAutomationNodes } from "./WorkspaceAutomationNodes";

export type WorkspaceAutomationField = (typeof FIELDS)["workspace_automations_list"][number];
export type WorkspaceAutomationOrderBy = (typeof ORDER_BY)["workspace_automations_list"][number];

export interface ListWorkspaceAutomationsParams {
  fields?: readonly WorkspaceAutomationField[];
  name?: string;
  scope?: string;
  status?: AutomationStatus | string;
  is_enabled?: boolean;
  is_global?: boolean;
  search?: string;
  order_by?: WorkspaceAutomationOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkspaceAutomationShapeParams {
  fields?: readonly WorkspaceAutomationField[];
}

/** Automations scoped to the whole workspace (`is_global=True`) — project-less sibling of `ProjectAutomations`. */
export class WorkspaceAutomations extends LoadsNavigableRows<
  Automation,
  CreateAutomation,
  UpdateAutomation,
  WorkspaceAutomationNavigation
> {
  protected path = "/workspaces/{slug}/automations/";
  protected extraPaths = {
    // `status` is the URL segment, `setStatus` the method and the `operations` key.
    setStatus: "/workspaces/{slug}/automations/{automation_id}/status/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_automations_list",
    retrieve: "workspace_automations_retrieve",
    create: "workspace_automations_create",
    update: "workspace_automations_partial_update",
    delete: "workspace_automations_destroy",
    setStatus: "workspace_automations_status",
  };
  protected loadedIdNames = WORKSPACE_AUTOMATION_ID_NAMES;

  public nodes: WorkspaceAutomationNodes;
  public edges: WorkspaceAutomationEdges;
  public activities: WorkspaceAutomationActivities;

  constructor(transport: V2Transport) {
    super(transport);
    this.nodes = new WorkspaceAutomationNodes(transport);
    this.edges = new WorkspaceAutomationEdges(transport);
    this.activities = new WorkspaceAutomationActivities(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WorkspaceAutomationNavigation> {
    const ids = meta.ids as [string, string];
    return {
      nodes: () => owned(this.nodes, ids, meta.idNames),
      edges: () => owned(this.edges, ids, meta.idNames),
      activities: () => owned(this.activities, ids, meta.idNames),
    };
  }

  private _at(slug: string, automation?: string): Record<string, string> {
    const params: Record<string, string> = { slug };
    if (automation !== undefined) params.pk = automation;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceAutomationField, "all"> & keyof Automation>(
    slug: string,
    params: ListWorkspaceAutomationsParams & { fields: readonly F[] }
  ): Promise<Page<LoadedWorkspaceAutomationRow<Pick<Automation, F | "id">>>>;
  list(slug: string, params?: ListWorkspaceAutomationsParams): Promise<Page<LoadedWorkspaceAutomation>>;
  async list(slug: string, params?: ListWorkspaceAutomationsParams): Promise<Page<LoadedWorkspaceAutomation>> {
    const page = await this.doList(this._at(slug), params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every workspace-scoped automation, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<WorkspaceAutomationField, "all"> & keyof Automation>(
    slug: string,
    params: ListWorkspaceAutomationsParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedWorkspaceAutomationRow<Pick<Automation, F | "id">>>;
  iterate(slug: string, params?: ListWorkspaceAutomationsParams): AsyncGenerator<LoadedWorkspaceAutomation>;
  iterate(slug: string, params?: ListWorkspaceAutomationsParams): AsyncGenerator<LoadedWorkspaceAutomation> {
    return this.loadIterate(this.doIterate(this._at(slug), params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<WorkspaceAutomationField, "all"> & keyof Automation>(
    slug: string,
    automation: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedWorkspaceAutomationRow<Pick<Automation, F | "id">>>;
  retrieve(
    slug: string,
    automation: string,
    params?: WorkspaceAutomationShapeParams
  ): Promise<LoadedWorkspaceAutomation>;
  async retrieve(
    slug: string,
    automation: string,
    params?: WorkspaceAutomationShapeParams
  ): Promise<LoadedWorkspaceAutomation> {
    const row = await this.doRetrieve(this._at(slug, automation), params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** The one automation with this name; throws if none or several match. */
  async findByName(slug: string, name: string): Promise<LoadedWorkspaceAutomation> {
    const row = await this.doFindOne({ name }, this._at(slug));
    return this.load(row, [slug]);
  }

  create<F extends Exclude<WorkspaceAutomationField, "all"> & keyof Automation>(
    slug: string,
    data: CreateAutomation,
    params: WorkspaceAutomationShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkspaceAutomationRow<Pick<Automation, F | "id">>>;
  create(
    slug: string,
    data: CreateAutomation,
    params?: WorkspaceAutomationShapeParams
  ): Promise<LoadedWorkspaceAutomation>;
  async create(
    slug: string,
    data: CreateAutomation,
    params?: WorkspaceAutomationShapeParams
  ): Promise<LoadedWorkspaceAutomation> {
    const row = await this.doCreate(data, this._at(slug), params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  update<F extends Exclude<WorkspaceAutomationField, "all"> & keyof Automation>(
    slug: string,
    automation: string,
    data: UpdateAutomation,
    params: WorkspaceAutomationShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkspaceAutomationRow<Pick<Automation, F | "id">>>;
  update(
    slug: string,
    automation: string,
    data: UpdateAutomation,
    params?: WorkspaceAutomationShapeParams
  ): Promise<LoadedWorkspaceAutomation>;
  async update(
    slug: string,
    automation: string,
    data: UpdateAutomation,
    params?: WorkspaceAutomationShapeParams
  ): Promise<LoadedWorkspaceAutomation> {
    const row = await this.doUpdate(data, this._at(slug, automation), params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  delete(slug: string, automation: string): Promise<void> {
    return this.doDelete(this._at(slug, automation));
  }

  /** Enable/disable the automation — the only way to flip `is_enabled`/`status`. */
  async setStatus(slug: string, automation: string, data: SetAutomationStatus): Promise<void> {
    await this.doCustomAction<void>("setStatus", {
      method: "POST",
      pathParams: { slug, automation_id: automation },
      data,
    });
  }
}
