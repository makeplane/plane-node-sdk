import { Page } from "../../../models/v2/common";
import { AutomationEdge, UpdateAutomationEdge, CreateAutomationEdge } from "../../../models/v2/AutomationEdge";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkspaceAutomationEdgeField = (typeof FIELDS)["workspace_automation_edges_list"][number];
export type WorkspaceAutomationEdgeOrderBy = (typeof ORDER_BY)["workspace_automation_edges_list"][number];

export interface ListWorkspaceAutomationEdgesParams {
  fields?: readonly WorkspaceAutomationEdgeField[];
  source_node_id?: string;
  target_node_id?: string;
  order_by?: WorkspaceAutomationEdgeOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Edges between nodes of a workspace-scoped (global) automation's graph, at `...automations.edges`. */
export class WorkspaceAutomationEdges extends V2Resource<AutomationEdge, CreateAutomationEdge, UpdateAutomationEdge> {
  protected path = "/workspaces/{slug}/automations/{automation_id}/edges/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_automation_edges_list",
    retrieve: "workspace_automation_edges_retrieve",
    create: "workspace_automation_edges_create",
    update: "workspace_automation_edges_partial_update",
    delete: "workspace_automation_edges_destroy",
  };

  private pk(automationId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { automation_id: automationId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceAutomationEdgeField, "all"> & keyof AutomationEdge>(
    automationId: string,
    params: ListWorkspaceAutomationEdgesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationEdge, F | "id">>>;
  list(automationId: string, params?: ListWorkspaceAutomationEdgesParams): Promise<Page<AutomationEdge>>;
  list(automationId: string, params?: ListWorkspaceAutomationEdgesParams): Promise<Page<AutomationEdge>> {
    return this.doList(this.pk(automationId), params as Record<string, unknown>);
  }

  /** Every edge, following pages automatically. */
  iterate(automationId: string, params?: ListWorkspaceAutomationEdgesParams): AsyncGenerator<AutomationEdge> {
    return this.doIterate(this.pk(automationId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAutomationEdgeField, "all"> & keyof AutomationEdge>(
    automationId: string,
    edgeId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationEdge, F | "id">>;
  retrieve(
    automationId: string,
    edgeId: string,
    params?: { fields?: readonly WorkspaceAutomationEdgeField[] }
  ): Promise<AutomationEdge>;
  retrieve(
    automationId: string,
    edgeId: string,
    params?: { fields?: readonly WorkspaceAutomationEdgeField[] }
  ): Promise<AutomationEdge> {
    return this.doRetrieve(this.pk(automationId, edgeId), params as Record<string, unknown>);
  }

  create(automationId: string, data: CreateAutomationEdge): Promise<AutomationEdge> {
    return this.doCreate(data, this.pk(automationId));
  }

  update(automationId: string, edgeId: string, data: UpdateAutomationEdge): Promise<AutomationEdge> {
    return this.doUpdate(data, this.pk(automationId, edgeId));
  }

  delete(automationId: string, edgeId: string): Promise<void> {
    return this.doDelete(this.pk(automationId, edgeId));
  }
}
