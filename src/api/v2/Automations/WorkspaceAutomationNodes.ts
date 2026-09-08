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

export type WorkspaceAutomationNodeField = (typeof FIELDS)["workspace_automation_nodes_list"][number];
export type WorkspaceAutomationNodeOrderBy = (typeof ORDER_BY)["workspace_automation_nodes_list"][number];

export interface ListWorkspaceAutomationNodesParams {
  fields?: readonly WorkspaceAutomationNodeField[];
  handler_name?: string;
  is_enabled?: boolean;
  name?: string;
  node_type?: AutomationNodeType | string;
  search?: string;
  order_by?: WorkspaceAutomationNodeOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkspaceAutomationNodeShapeParams {
  fields?: readonly WorkspaceAutomationNodeField[];
}

/** Nodes in a workspace-scoped (global) automation's trigger/action/condition graph, at `...automations.nodes`. */
export class WorkspaceAutomationNodes extends V2Resource<AutomationNode, CreateAutomationNode, UpdateAutomationNode> {
  protected path = "/workspaces/{slug}/automations/{automation_id}/nodes/";
  protected extraPaths = {
    // The API spells the verb with hyphens while the method is camelCase, and the
    // `operations` key has to be the method name (`operations-coverage.test.ts`).
    // A template override lets neither bend — see `WorkItemTypes.extraPaths`.
    regenerateWebhookSecret:
      "/workspaces/{slug}/automations/{automation_id}/nodes/{node_id}/regenerate-webhook-secret/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_automation_nodes_list",
    retrieve: "workspace_automation_nodes_retrieve",
    create: "workspace_automation_nodes_create",
    update: "workspace_automation_nodes_partial_update",
    delete: "workspace_automation_nodes_destroy",
    regenerateWebhookSecret: "workspace_automation_nodes_regenerate_webhook_secret",
  };

  private _at(slug: string, automation: string, node?: string): Record<string, string> {
    const params: Record<string, string> = { slug, automation_id: automation };
    if (node !== undefined) params.pk = node;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceAutomationNodeField, "all"> & keyof AutomationNode>(
    slug: string,
    automation: string,
    params: ListWorkspaceAutomationNodesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationNode, F | "id">>>;
  list(slug: string, automation: string, params?: ListWorkspaceAutomationNodesParams): Promise<Page<AutomationNode>>;
  list(slug: string, automation: string, params?: ListWorkspaceAutomationNodesParams): Promise<Page<AutomationNode>> {
    return this.doList(this._at(slug, automation), params as Record<string, unknown>);
  }

  /** Every node, following pages automatically. */
  iterate<F extends Exclude<WorkspaceAutomationNodeField, "all"> & keyof AutomationNode>(
    slug: string,
    automation: string,
    params: ListWorkspaceAutomationNodesParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<AutomationNode, F | "id">>;
  iterate(
    slug: string,
    automation: string,
    params?: ListWorkspaceAutomationNodesParams
  ): AsyncGenerator<AutomationNode>;
  iterate(
    slug: string,
    automation: string,
    params?: ListWorkspaceAutomationNodesParams
  ): AsyncGenerator<AutomationNode> {
    return this.doIterate(this._at(slug, automation), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAutomationNodeField, "all"> & keyof AutomationNode>(
    slug: string,
    automation: string,
    node: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationNode, F | "id">>;
  retrieve(
    slug: string,
    automation: string,
    node: string,
    params?: { fields?: readonly WorkspaceAutomationNodeField[] }
  ): Promise<AutomationNode>;
  retrieve(
    slug: string,
    automation: string,
    node: string,
    params?: { fields?: readonly WorkspaceAutomationNodeField[] }
  ): Promise<AutomationNode> {
    return this.doRetrieve(this._at(slug, automation, node), params as Record<string, unknown>);
  }

  /** The one node with this name; throws if none or several match. */
  findByName(slug: string, automation: string, name: string): Promise<AutomationNode> {
    return this.doFindOne({ name }, this._at(slug, automation));
  }

  create(
    slug: string,
    automation: string,
    data: CreateAutomationNode,
    params?: WorkspaceAutomationNodeShapeParams
  ): Promise<AutomationNode> {
    return this.doCreate(data, this._at(slug, automation), params as Record<string, unknown>);
  }

  update(
    slug: string,
    automation: string,
    node: string,
    data: UpdateAutomationNode,
    params?: WorkspaceAutomationNodeShapeParams
  ): Promise<AutomationNode> {
    return this.doUpdate(data, this._at(slug, automation, node), params as Record<string, unknown>);
  }

  delete(slug: string, automation: string, node: string): Promise<void> {
    return this.doDelete(this._at(slug, automation, node));
  }

  /** Invalidates this webhook-trigger node's current secret and issues a new one. */
  regenerateWebhookSecret(slug: string, automation: string, node: string): Promise<AutomationWebhookSecret> {
    return this.doCustomAction<AutomationWebhookSecret>("regenerateWebhookSecret", {
      method: "POST",
      pathParams: { slug, automation_id: automation, node_id: node },
    });
  }
}
