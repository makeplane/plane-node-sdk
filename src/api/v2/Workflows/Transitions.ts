import { Page } from "../../../models/v2/common";
import {
  WorkflowTransition,
  UpdateWorkflowTransition,
  CreateWorkflowTransition,
} from "../../../models/v2/WorkflowTransition";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkflowTransitionField = (typeof FIELDS)["workflow_transitions_list"][number];
export type WorkflowTransitionOrderBy = (typeof ORDER_BY)["workflow_transitions_list"][number];

export interface ListWorkflowTransitionsParams {
  fields?: readonly WorkflowTransitionField[];
  order_by?: WorkflowTransitionOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Transition edges of a workflow graph. `create` identifies the source state by its project State id. */
export class WorkflowTransitions extends V2Resource<
  WorkflowTransition,
  CreateWorkflowTransition,
  UpdateWorkflowTransition
> {
  protected path = "/workspaces/{slug}/projects/{project_id}/workflows/{workflow_id}/state-transitions/";
  protected operations: Record<string, OperationId> = {
    list: "workflow_transitions_list",
    retrieve: "workflow_transitions_retrieve",
    create: "workflow_transitions_create",
    update: "workflow_transitions_partial_update",
    delete: "workflow_transitions_destroy",
  };

  private pk(workflowId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { workflow_id: workflowId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkflowTransitionField, "all"> & keyof WorkflowTransition>(
    workflowId: string,
    params: ListWorkflowTransitionsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkflowTransition, F | "id">>>;
  list(workflowId: string, params?: ListWorkflowTransitionsParams): Promise<Page<WorkflowTransition>>;
  list(workflowId: string, params?: ListWorkflowTransitionsParams): Promise<Page<WorkflowTransition>> {
    return this.doList(this.pk(workflowId), params as Record<string, unknown>);
  }

  /** Every transition, following pages automatically. */
  iterate(workflowId: string, params?: ListWorkflowTransitionsParams): AsyncGenerator<WorkflowTransition> {
    return this.doIterate(this.pk(workflowId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkflowTransitionField, "all"> & keyof WorkflowTransition>(
    workflowId: string,
    transitionId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkflowTransition, F | "id">>;
  retrieve(
    workflowId: string,
    transitionId: string,
    params?: { fields?: readonly WorkflowTransitionField[] }
  ): Promise<WorkflowTransition>;
  retrieve(
    workflowId: string,
    transitionId: string,
    params?: { fields?: readonly WorkflowTransitionField[] }
  ): Promise<WorkflowTransition> {
    return this.doRetrieve(this.pk(workflowId, transitionId), params as Record<string, unknown>);
  }

  create(workflowId: string, data: CreateWorkflowTransition): Promise<WorkflowTransition> {
    return this.doCreate(data, this.pk(workflowId));
  }

  update(workflowId: string, transitionId: string, data: UpdateWorkflowTransition): Promise<WorkflowTransition> {
    return this.doUpdate(data, this.pk(workflowId, transitionId));
  }

  delete(workflowId: string, transitionId: string): Promise<void> {
    return this.doDelete(this.pk(workflowId, transitionId));
  }
}
