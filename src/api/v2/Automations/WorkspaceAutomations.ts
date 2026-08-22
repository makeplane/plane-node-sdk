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

/** Automations scoped to the whole workspace (`is_global=True`) — project-less sibling of `ProjectAutomations`. */
export class WorkspaceAutomations extends V2Resource<Automation, CreateAutomation, UpdateAutomation> {
  protected path = "/workspaces/{slug}/automations/";
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_automations_list",
    retrieve: "workspace_automations_retrieve",
    create: "workspace_automations_create",
    update: "workspace_automations_partial_update",
    delete: "workspace_automations_destroy",
    setStatus: "workspace_automations_status",
  };

  public nodes: WorkspaceAutomationNodes;
  public edges: WorkspaceAutomationEdges;
  public activities: WorkspaceAutomationActivities;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.nodes = new WorkspaceAutomationNodes(transport, scope);
    this.edges = new WorkspaceAutomationEdges(transport, scope);
    this.activities = new WorkspaceAutomationActivities(transport, scope);
  }

  private pk(id?: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceAutomationField, "all"> & keyof Automation>(
    params: ListWorkspaceAutomationsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Automation, F | "id">>>;
  list(params?: ListWorkspaceAutomationsParams): Promise<Page<Automation>>;
  list(params?: ListWorkspaceAutomationsParams): Promise<Page<Automation>> {
    return this.doList(this.pk(), params as Record<string, unknown>);
  }

  /** Every workspace-scoped automation, following pages automatically. */
  iterate(params?: ListWorkspaceAutomationsParams): AsyncGenerator<Automation> {
    return this.doIterate(this.pk(), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAutomationField, "all"> & keyof Automation>(
    automationId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Automation, F | "id">>;
  retrieve(automationId: string, params?: { fields?: readonly WorkspaceAutomationField[] }): Promise<Automation>;
  retrieve(automationId: string, params?: { fields?: readonly WorkspaceAutomationField[] }): Promise<Automation> {
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
