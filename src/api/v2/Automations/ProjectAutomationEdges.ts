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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface ProjectAutomationEdgeShapeParams {
  fields?: readonly ProjectAutomationEdgeField[];
}

/**
 * Edges between nodes of a project-scoped automation's graph.
 *
 * Reached flat — `v2.workspaces.projects.automations.edges.list(slug, project, automation)` — or from a fetched automation: `automation.edges.list()`.
 */
export class ProjectAutomationEdges extends V2Resource<AutomationEdge, CreateAutomationEdge, UpdateAutomationEdge> {
  protected path = "/workspaces/{slug}/projects/{project_id}/automations/{automation_id}/edges/";
  protected operations: Record<string, OperationId> = {
    list: "project_automation_edges_list",
    retrieve: "project_automation_edges_retrieve",
    create: "project_automation_edges_create",
    update: "project_automation_edges_partial_update",
    delete: "project_automation_edges_destroy",
  };

  private _at(slug: string, project: string, automation: string, edge?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project, automation_id: automation };
    if (edge !== undefined) params.pk = edge;
    return params;
  }

  /**
   * One page of `AutomationEdge` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<ProjectAutomationEdgeField, "all"> & keyof AutomationEdge>(
    slug: string,
    project: string,
    automation: string,
    params: ListProjectAutomationEdgesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationEdge, F | "id">>>;
  /** One page of `AutomationEdge` rows. Use `iterate` to follow pages automatically. */
  list(
    slug: string,
    project: string,
    automation: string,
    params?: ListProjectAutomationEdgesParams
  ): Promise<Page<AutomationEdge>>;
  list(
    slug: string,
    project: string,
    automation: string,
    params?: ListProjectAutomationEdgesParams
  ): Promise<Page<AutomationEdge>> {
    return this.doList(this._at(slug, project, automation), params as Record<string, unknown>);
  }

  /** Every edge, following pages automatically. */
  iterate<F extends Exclude<ProjectAutomationEdgeField, "all"> & keyof AutomationEdge>(
    slug: string,
    project: string,
    automation: string,
    params: Omit<ListProjectAutomationEdgesParams, "offset" | "count"> & {
      fields: readonly F[];
    }
  ): AsyncGenerator<Pick<AutomationEdge, F | "id">>;
  /** Every edge, following pages automatically. */
  iterate(
    slug: string,
    project: string,
    automation: string,
    params?: Omit<ListProjectAutomationEdgesParams, "offset" | "count">
  ): AsyncGenerator<AutomationEdge>;
  iterate(
    slug: string,
    project: string,
    automation: string,
    params?: Omit<ListProjectAutomationEdgesParams, "offset" | "count">
  ): AsyncGenerator<AutomationEdge> {
    return this.doIterate(this._at(slug, project, automation), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ProjectAutomationEdgeField, "all"> & keyof AutomationEdge>(
    slug: string,
    project: string,
    automation: string,
    edge: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationEdge, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    automation: string,
    edge: string,
    params?: { fields?: readonly ProjectAutomationEdgeField[] }
  ): Promise<AutomationEdge>;
  retrieve(
    slug: string,
    project: string,
    automation: string,
    edge: string,
    params?: { fields?: readonly ProjectAutomationEdgeField[] }
  ): Promise<AutomationEdge> {
    return this.doRetrieve(this._at(slug, project, automation, edge), params as Record<string, unknown>);
  }

  create<F extends Exclude<ProjectAutomationEdgeField, "all"> & keyof AutomationEdge>(
    slug: string,
    project: string,
    automation: string,
    data: CreateAutomationEdge,
    params: ProjectAutomationEdgeShapeParams & { fields: readonly F[] }
  ): Promise<Pick<AutomationEdge, F | "id">>;
  create(
    slug: string,
    project: string,
    automation: string,
    data: CreateAutomationEdge,
    params?: ProjectAutomationEdgeShapeParams
  ): Promise<AutomationEdge>;
  create(
    slug: string,
    project: string,
    automation: string,
    data: CreateAutomationEdge,
    params?: ProjectAutomationEdgeShapeParams
  ): Promise<AutomationEdge> {
    return this.doCreate(data, this._at(slug, project, automation), params as Record<string, unknown>);
  }

  update<F extends Exclude<ProjectAutomationEdgeField, "all"> & keyof AutomationEdge>(
    slug: string,
    project: string,
    automation: string,
    edge: string,
    data: UpdateAutomationEdge,
    params: ProjectAutomationEdgeShapeParams & { fields: readonly F[] }
  ): Promise<Pick<AutomationEdge, F | "id">>;
  update(
    slug: string,
    project: string,
    automation: string,
    edge: string,
    data: UpdateAutomationEdge,
    params?: ProjectAutomationEdgeShapeParams
  ): Promise<AutomationEdge>;
  update(
    slug: string,
    project: string,
    automation: string,
    edge: string,
    data: UpdateAutomationEdge,
    params?: ProjectAutomationEdgeShapeParams
  ): Promise<AutomationEdge> {
    return this.doUpdate(data, this._at(slug, project, automation, edge), params as Record<string, unknown>);
  }

  delete(slug: string, project: string, automation: string, edge: string): Promise<void> {
    return this.doDelete(this._at(slug, project, automation, edge));
  }
}
