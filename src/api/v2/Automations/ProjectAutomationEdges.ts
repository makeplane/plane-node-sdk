import { Page } from "../../../models/v2/common";
import { AutomationEdge, UpdateAutomationEdge, CreateAutomationEdge } from "../../../models/v2/AutomationEdge";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type ProjectAutomationEdgeField = (typeof FIELDS)["project_automation_edges_list"][number];
export type ProjectAutomationEdgeOrderBy = (typeof ORDER_BY)["project_automation_edges_list"][number];

export interface ListProjectAutomationEdgesParams {
  fields?: readonly ProjectAutomationEdgeField[];
  source_node_id?: string;
  target_node_id?: string;
  order_by?: ProjectAutomationEdgeOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Edges between nodes of a project-scoped automation's graph, at `...automations.edges`. */
export class ProjectAutomationEdges extends V2Resource<AutomationEdge, CreateAutomationEdge, UpdateAutomationEdge> {
  protected path = "/workspaces/{slug}/projects/{project_id}/automations/{automation_id}/edges/";
  protected operations: Record<string, OperationId> = {
    list: "project_automation_edges_list",
    retrieve: "project_automation_edges_retrieve",
    create: "project_automation_edges_create",
    update: "project_automation_edges_partial_update",
    delete: "project_automation_edges_destroy",
  };

  private pk(automationId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { automation_id: automationId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectAutomationEdgeField, "all"> & keyof AutomationEdge>(
    automationId: string,
    params: ListProjectAutomationEdgesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationEdge, F | "id">>>;
  list(automationId: string, params?: ListProjectAutomationEdgesParams): Promise<Page<AutomationEdge>>;
  list(automationId: string, params?: ListProjectAutomationEdgesParams): Promise<Page<AutomationEdge>> {
    return this.doList(this.pk(automationId), params as Record<string, unknown>);
  }

  /** Every edge, following pages automatically. */
  iterate(automationId: string, params?: ListProjectAutomationEdgesParams): AsyncGenerator<AutomationEdge> {
    return this.doIterate(this.pk(automationId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ProjectAutomationEdgeField, "all"> & keyof AutomationEdge>(
    automationId: string,
    edgeId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationEdge, F | "id">>;
  retrieve(
    automationId: string,
    edgeId: string,
    params?: { fields?: readonly ProjectAutomationEdgeField[] }
  ): Promise<AutomationEdge>;
  retrieve(
    automationId: string,
    edgeId: string,
    params?: { fields?: readonly ProjectAutomationEdgeField[] }
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
