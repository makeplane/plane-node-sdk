import {
  Automation,
  UpdateAutomation,
  AutomationStatus,
  SetAutomationStatus,
  CreateAutomation,
} from "../../../models/v2/Automation";
import { Page } from "../../../models/v2/common";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
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
  count?: boolean;
}

/** Automations scoped to one project — CRUD, `status`, and sub-resources `nodes`/`edges`/`activities`. */
export class ProjectAutomations extends V2Resource<Automation, CreateAutomation, UpdateAutomation> {
  protected path = "/workspaces/{slug}/projects/{project_id}/automations/";
  protected operations: Record<string, AnyOperationId> = {
    list: "project_automations_list",
    retrieve: "project_automations_retrieve",
    create: "project_automations_create",
    update: "project_automations_partial_update",
    delete: "project_automations_destroy",
    setStatus: "project_automations_status",
  };

  public nodes: ProjectAutomationNodes;
  public edges: ProjectAutomationEdges;
  public activities: ProjectAutomationActivities;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.nodes = new ProjectAutomationNodes(transport, scope);
    this.edges = new ProjectAutomationEdges(transport, scope);
    this.activities = new ProjectAutomationActivities(transport, scope);
  }

  private pk(id?: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectAutomationField, "all"> & keyof Automation>(
    params: ListProjectAutomationsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Automation, F | "id">>>;
  list(params?: ListProjectAutomationsParams): Promise<Page<Automation>>;
  list(params?: ListProjectAutomationsParams): Promise<Page<Automation>> {
    return this.doList(this.pk(), params as Record<string, unknown>);
  }

  /** Every automation in the project, following pages automatically. */
  iterate(params?: ListProjectAutomationsParams): AsyncGenerator<Automation> {
    return this.doIterate(this.pk(), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ProjectAutomationField, "all"> & keyof Automation>(
    automationId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Automation, F | "id">>;
  retrieve(automationId: string, params?: { fields?: readonly ProjectAutomationField[] }): Promise<Automation>;
  retrieve(automationId: string, params?: { fields?: readonly ProjectAutomationField[] }): Promise<Automation> {
    return this.doRetrieve(this.pk(automationId), params as Record<string, unknown>);
  }

  /** The one automation with this name; throws if none or several match. */
  findByName(name: string): Promise<Automation> {
    return this.doFindOne({ name }, this.pk());
  }

  create(data: CreateAutomation): Promise<Automation> {
    return this.doCreate(data, this.pk());
  }

  update(automationId: string, data: UpdateAutomation): Promise<Automation> {
    return this.doUpdate(data, this.pk(automationId));
  }

  delete(automationId: string): Promise<void> {
    return this.doDelete(this.pk(automationId));
  }

  /** Enable/disable the automation — the only way to flip `is_enabled`/`status`. */
  async setStatus(automationId: string, data: SetAutomationStatus): Promise<void> {
    await this.transport.request<void>("POST", `${this.detailUrl(this.pk(automationId))}status/`, {
      data,
    });
  }
}
