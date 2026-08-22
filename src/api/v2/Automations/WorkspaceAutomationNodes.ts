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

/** Nodes in a workspace-scoped (global) automation's trigger/action/condition graph, at `...automations.nodes`. */
export class WorkspaceAutomationNodes extends V2Resource<AutomationNode, CreateAutomationNode, UpdateAutomationNode> {
  protected path = "/workspaces/{slug}/automations/{automation_id}/nodes/";
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_automation_nodes_list",
    retrieve: "workspace_automation_nodes_retrieve",
    create: "workspace_automation_nodes_create",
    update: "workspace_automation_nodes_partial_update",
    delete: "workspace_automation_nodes_destroy",
    "regenerate-webhook-secret": "workspace_automation_nodes_regenerate_webhook_secret",
  };

  private pk(automationId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { automation_id: automationId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceAutomationNodeField, "all"> & keyof AutomationNode>(
    automationId: string,
    params: ListWorkspaceAutomationNodesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<AutomationNode, F | "id">>>;
  list(automationId: string, params?: ListWorkspaceAutomationNodesParams): Promise<Page<AutomationNode>>;
  list(automationId: string, params?: ListWorkspaceAutomationNodesParams): Promise<Page<AutomationNode>> {
    return this.doList(this.pk(automationId), params as Record<string, unknown>);
  }

  /** Every node, following pages automatically. */
  iterate(automationId: string, params?: ListWorkspaceAutomationNodesParams): AsyncGenerator<AutomationNode> {
    return this.doIterate(this.pk(automationId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAutomationNodeField, "all"> & keyof AutomationNode>(
    automationId: string,
    nodeId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<AutomationNode, F | "id">>;
  retrieve(
    automationId: string,
    nodeId: string,
    params?: { fields?: readonly WorkspaceAutomationNodeField[] }
  ): Promise<AutomationNode>;
  retrieve(
    automationId: string,
    nodeId: string,
    params?: { fields?: readonly WorkspaceAutomationNodeField[] }
  ): Promise<AutomationNode> {
    return this.doRetrieve(this.pk(automationId, nodeId), params as Record<string, unknown>);
  }

  /** The one node with this name; throws if none or several match. */
  findByName(automationId: string, name: string): Promise<AutomationNode> {
    return this.doFindOne({ name }, this.pk(automationId));
  }

  create(automationId: string, data: CreateAutomationNode): Promise<AutomationNode> {
    return this.doCreate(data, this.pk(automationId));
  }

  update(automationId: string, nodeId: string, data: UpdateAutomationNode): Promise<AutomationNode> {
    return this.doUpdate(data, this.pk(automationId, nodeId));
  }

  delete(automationId: string, nodeId: string): Promise<void> {
    return this.doDelete(this.pk(automationId, nodeId));
  }

  /** Invalidates this webhook-trigger node's current secret and issues a new one. */
  regenerateWebhookSecret(automationId: string, nodeId: string): Promise<AutomationWebhookSecret> {
    return this.doAction<AutomationWebhookSecret>("regenerate-webhook-secret", this.pk(automationId, nodeId));
  }
}
