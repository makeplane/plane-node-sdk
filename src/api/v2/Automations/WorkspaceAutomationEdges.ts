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

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkspaceAutomationEdgeShapeParams {
  fields?: readonly WorkspaceAutomationEdgeField[];
}

/**
 * Edges between nodes of a workspace-scoped (global) automation's graph.
 *
 * Reached flat — `v2.workspaces.automations.edges.list(slug, automation)` — or from a fetched automation: `automation.edges.list()`.
 */
export class WorkspaceAutomationEdges extends V2Resource<AutomationEdge, CreateAutomationEdge, UpdateAutomationEdge> {
  protected path = "/workspaces/{slug}/automations/{automation_id}/edges/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_automation_edges_list",
    retrieve: "workspace_automation_edges_retrieve",
    create: "workspace_automation_edges_create",
    update: "workspace_automation_edges_partial_update",
    delete: "workspace_automation_edges_destroy",
  };

  private _at(slug: string, automation: string, edge?: string): Record<string, string> {
    const params: Record<string, string> = { slug, automation_id: automation };
    if (edge !== undefined) params.pk = edge;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceAutomationEdgeField, "all"> & keyof AutomationEdge>(
    slug: string,
    automation: string,
    params: ListWorkspaceAutomationEdgesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationEdge, F | "id">>>;
  list(slug: string, automation: string, params?: ListWorkspaceAutomationEdgesParams): Promise<Page<AutomationEdge>>;
  list(slug: string, automation: string, params?: ListWorkspaceAutomationEdgesParams): Promise<Page<AutomationEdge>> {
    return this.doList(this._at(slug, automation), params as Record<string, unknown>);
  }

  /** Every edge, following pages automatically. */
  iterate<F extends Exclude<WorkspaceAutomationEdgeField, "all"> & keyof AutomationEdge>(
    slug: string,
    automation: string,
    params: ListWorkspaceAutomationEdgesParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<AutomationEdge, F | "id">>;
  iterate(
    slug: string,
    automation: string,
    params?: ListWorkspaceAutomationEdgesParams
  ): AsyncGenerator<AutomationEdge>;
  iterate(
    slug: string,
    automation: string,
    params?: ListWorkspaceAutomationEdgesParams
  ): AsyncGenerator<AutomationEdge> {
    return this.doIterate(this._at(slug, automation), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAutomationEdgeField, "all"> & keyof AutomationEdge>(
    slug: string,
    automation: string,
    edge: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationEdge, F | "id">>;
  retrieve(
    slug: string,
    automation: string,
    edge: string,
    params?: { fields?: readonly WorkspaceAutomationEdgeField[] }
  ): Promise<AutomationEdge>;
  retrieve(
    slug: string,
    automation: string,
    edge: string,
    params?: { fields?: readonly WorkspaceAutomationEdgeField[] }
  ): Promise<AutomationEdge> {
    return this.doRetrieve(this._at(slug, automation, edge), params as Record<string, unknown>);
  }

  create(
    slug: string,
    automation: string,
    data: CreateAutomationEdge,
    params?: WorkspaceAutomationEdgeShapeParams
  ): Promise<AutomationEdge> {
    return this.doCreate(data, this._at(slug, automation), params as Record<string, unknown>);
  }

  update(
    slug: string,
    automation: string,
    edge: string,
    data: UpdateAutomationEdge,
    params?: WorkspaceAutomationEdgeShapeParams
  ): Promise<AutomationEdge> {
    return this.doUpdate(data, this._at(slug, automation, edge), params as Record<string, unknown>);
  }

  delete(slug: string, automation: string, edge: string): Promise<void> {
    return this.doDelete(this._at(slug, automation, edge));
  }
}
