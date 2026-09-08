import { Page } from "../../../models/v2/common";
import {
  AutomationNode,
  UpdateAutomationNode,
  AutomationNodeType,
  CreateAutomationNode,
  AutomationWebhookSecret,
} from "../../../models/v2/AutomationNode";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type ProjectAutomationNodeField = (typeof FIELDS)["project_automation_nodes_list"][number];
export type ProjectAutomationNodeOrderBy = (typeof ORDER_BY)["project_automation_nodes_list"][number];

export interface ListProjectAutomationNodesParams {
  fields?: readonly ProjectAutomationNodeField[];
  handler_name?: string;
  is_enabled?: boolean;
  name?: string;
  node_type?: AutomationNodeType | string;
  search?: string;
  order_by?: ProjectAutomationNodeOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface ProjectAutomationNodeShapeParams {
  fields?: readonly ProjectAutomationNodeField[];
}

/**
 * Nodes in a project-scoped automation's trigger/action/condition graph.
 *
 * Reached flat — `v2.workspaces.projects.automations.nodes.list(slug, project, automation)` — or from a fetched automation: `automation.nodes.list()`.
 */
export class ProjectAutomationNodes extends V2Resource<AutomationNode, CreateAutomationNode, UpdateAutomationNode> {
  protected path = "/workspaces/{slug}/projects/{project_id}/automations/{automation_id}/nodes/";
  protected extraPaths = {
    // The API spells the verb with hyphens while the method is camelCase, and the
    // `operations` key has to be the method name (`operations-coverage.test.ts`).
    // A template override lets neither bend — see `WorkItemTypes.extraPaths`.
    regenerateWebhookSecret:
      "/workspaces/{slug}/projects/{project_id}/automations/{automation_id}/nodes/{node_id}/regenerate-webhook-secret/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "project_automation_nodes_list",
    retrieve: "project_automation_nodes_retrieve",
    create: "project_automation_nodes_create",
    update: "project_automation_nodes_partial_update",
    delete: "project_automation_nodes_destroy",
    regenerateWebhookSecret: "project_automation_nodes_regenerate_webhook_secret",
  };

  private _at(slug: string, project: string, automation: string, node?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project, automation_id: automation };
    if (node !== undefined) params.pk = node;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectAutomationNodeField, "all"> & keyof AutomationNode>(
    slug: string,
    project: string,
    automation: string,
    params: ListProjectAutomationNodesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationNode, F | "id">>>;
  list(
    slug: string,
    project: string,
    automation: string,
    params?: ListProjectAutomationNodesParams
  ): Promise<Page<AutomationNode>>;
  list(
    slug: string,
    project: string,
    automation: string,
    params?: ListProjectAutomationNodesParams
  ): Promise<Page<AutomationNode>> {
    return this.doList(this._at(slug, project, automation), params as Record<string, unknown>);
  }

  /** Every node, following pages automatically. */
  iterate<F extends Exclude<ProjectAutomationNodeField, "all"> & keyof AutomationNode>(
    slug: string,
    project: string,
    automation: string,
    params: Omit<ListProjectAutomationNodesParams, "offset" | "count"> & {
      fields: readonly F[];
    }
  ): AsyncGenerator<Pick<AutomationNode, F | "id">>;
  iterate(
    slug: string,
    project: string,
    automation: string,
    params?: Omit<ListProjectAutomationNodesParams, "offset" | "count">
  ): AsyncGenerator<AutomationNode>;
  iterate(
    slug: string,
    project: string,
    automation: string,
    params?: Omit<ListProjectAutomationNodesParams, "offset" | "count">
  ): AsyncGenerator<AutomationNode> {
    return this.doIterate(this._at(slug, project, automation), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ProjectAutomationNodeField, "all"> & keyof AutomationNode>(
    slug: string,
    project: string,
    automation: string,
    node: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationNode, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    automation: string,
    node: string,
    params?: { fields?: readonly ProjectAutomationNodeField[] }
  ): Promise<AutomationNode>;
  retrieve(
    slug: string,
    project: string,
    automation: string,
    node: string,
    params?: { fields?: readonly ProjectAutomationNodeField[] }
  ): Promise<AutomationNode> {
    return this.doRetrieve(this._at(slug, project, automation, node), params as Record<string, unknown>);
  }

  /** The one node with this name; throws if none or several match. */
  findByName(slug: string, project: string, automation: string, name: string): Promise<AutomationNode> {
    return this.doFindOne({ name }, this._at(slug, project, automation));
  }

  create<F extends Exclude<ProjectAutomationNodeField, "all"> & keyof AutomationNode>(
    slug: string,
    project: string,
    automation: string,
    data: CreateAutomationNode,
    params: ProjectAutomationNodeShapeParams & { fields: readonly F[] }
  ): Promise<Pick<AutomationNode, F | "id">>;
  create(
    slug: string,
    project: string,
    automation: string,
    data: CreateAutomationNode,
    params?: ProjectAutomationNodeShapeParams
  ): Promise<AutomationNode>;
  create(
    slug: string,
    project: string,
    automation: string,
    data: CreateAutomationNode,
    params?: ProjectAutomationNodeShapeParams
  ): Promise<AutomationNode> {
    return this.doCreate(data, this._at(slug, project, automation), params as Record<string, unknown>);
  }

  update<F extends Exclude<ProjectAutomationNodeField, "all"> & keyof AutomationNode>(
    slug: string,
    project: string,
    automation: string,
    node: string,
    data: UpdateAutomationNode,
    params: ProjectAutomationNodeShapeParams & { fields: readonly F[] }
  ): Promise<Pick<AutomationNode, F | "id">>;
  update(
    slug: string,
    project: string,
    automation: string,
    node: string,
    data: UpdateAutomationNode,
    params?: ProjectAutomationNodeShapeParams
  ): Promise<AutomationNode>;
  update(
    slug: string,
    project: string,
    automation: string,
    node: string,
    data: UpdateAutomationNode,
    params?: ProjectAutomationNodeShapeParams
  ): Promise<AutomationNode> {
    return this.doUpdate(data, this._at(slug, project, automation, node), params as Record<string, unknown>);
  }

  delete(slug: string, project: string, automation: string, node: string): Promise<void> {
    return this.doDelete(this._at(slug, project, automation, node));
  }

  /** Invalidates this webhook-trigger node's current secret and issues a new one. */
  regenerateWebhookSecret(
    slug: string,
    project: string,
    automation: string,
    node: string
  ): Promise<AutomationWebhookSecret> {
    return this.doCustomAction<AutomationWebhookSecret>("regenerateWebhookSecret", {
      method: "POST",
      pathParams: { slug, project_id: project, automation_id: automation, node_id: node },
    });
  }
}
