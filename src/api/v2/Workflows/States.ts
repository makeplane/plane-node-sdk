import { Page } from "../../../models/v2/common";
import { WorkflowState, WorkflowStateAttachRequest, UpdateWorkflowState } from "../../../models/v2/WorkflowState";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkflowStateField = (typeof FIELDS)["workflow_states_list"][number];
export type WorkflowStateOrderBy = (typeof ORDER_BY)["workflow_states_list"][number];

export interface ListWorkflowStatesParams {
  fields?: readonly WorkflowStateField[];
  order_by?: WorkflowStateOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Project states attached to a workflow. `attach` returns an array, not the single object the golden's `201` implies. */
export class WorkflowStates extends V2Resource<WorkflowState, WorkflowStateAttachRequest, UpdateWorkflowState> {
  protected path = "/workspaces/{slug}/projects/{project_id}/workflows/{workflow_id}/states/";
  protected operations: Record<string, OperationId> = {
    list: "workflow_states_list",
    retrieve: "workflow_states_retrieve",
    create: "workflow_states_create",
    update: "workflow_states_partial_update",
    delete: "workflow_states_destroy",
  };

  private pk(workflowId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { workflow_id: workflowId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkflowStateField, "all"> & keyof WorkflowState>(
    workflowId: string,
    params: ListWorkflowStatesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkflowState, F | "id">>>;
  list(workflowId: string, params?: ListWorkflowStatesParams): Promise<Page<WorkflowState>>;
  list(workflowId: string, params?: ListWorkflowStatesParams): Promise<Page<WorkflowState>> {
    return this.doList(this.pk(workflowId), params as Record<string, unknown>);
  }

  /** Every workflow state, following pages automatically. */
  iterate(workflowId: string, params?: ListWorkflowStatesParams): AsyncGenerator<WorkflowState> {
    return this.doIterate(this.pk(workflowId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkflowStateField, "all"> & keyof WorkflowState>(
    workflowId: string,
    workflowStateId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkflowState, F | "id">>;
  retrieve(
    workflowId: string,
    workflowStateId: string,
    params?: { fields?: readonly WorkflowStateField[] }
  ): Promise<WorkflowState>;
  retrieve(
    workflowId: string,
    workflowStateId: string,
    params?: { fields?: readonly WorkflowStateField[] }
  ): Promise<WorkflowState> {
    return this.doRetrieve(this.pk(workflowId, workflowStateId), params as Record<string, unknown>);
  }

  /** Attach project states to this workflow; already-attached ids are accepted idempotently. */
  async attach(
    workflowId: string,
    data: WorkflowStateAttachRequest,
    params?: { fields?: readonly WorkflowStateField[] }
  ): Promise<WorkflowState[]> {
    return this.transport.request<WorkflowState[]>("POST", this.collectionUrl(this.pk(workflowId)), {
      params: this.query(params as Record<string, unknown>, "create"),
      data,
    });
  }

  update(workflowId: string, workflowStateId: string, data: UpdateWorkflowState): Promise<WorkflowState> {
    return this.doUpdate(data, this.pk(workflowId, workflowStateId));
  }

  delete(workflowId: string, workflowStateId: string): Promise<void> {
    return this.doDelete(this.pk(workflowId, workflowStateId));
  }
}
