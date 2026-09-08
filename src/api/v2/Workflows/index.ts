import { Page } from "../../../models/v2/common";
import { Workflow, UpdateWorkflow, CreateWorkflow } from "../../../models/v2/Workflow";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { OperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { LoadedWorkflow, LoadedWorkflowRow, WORKFLOW_ID_NAMES, WorkflowNavigation } from "../loaded/Workflow";
import { WorkflowStates } from "./States";
import { WorkflowTransitions } from "./Transitions";

export type WorkflowField = (typeof FIELDS)["workflows_list"][number];
export type WorkflowOrderBy = (typeof ORDER_BY)["workflows_list"][number];

export interface ListWorkflowsParams {
  fields?: readonly WorkflowField[];
  search?: string;
  order_by?: WorkflowOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkflowShapeParams {
  fields?: readonly WorkflowField[];
}

/**
 * Project workflow graphs — CRUD plus `states`/`transitions`. No upsert/bulk-write here.
 *
 * Reached flat — `v2.projects.workflows.list(slug, project)` — or from a fetched project:
 * `project.workflows.list()`. Every row-returning method answers a {@link LoadedWorkflow},
 * so `workflow.states.list()` repeats no id.
 */
export class Workflows extends LoadsNavigableRows<Workflow, CreateWorkflow, UpdateWorkflow, WorkflowNavigation> {
  protected path = "/workspaces/{slug}/projects/{project_id}/workflows/";
  protected operations: Record<string, OperationId> = {
    list: "workflows_list",
    retrieve: "workflows_retrieve",
    create: "workflows_create",
    update: "workflows_partial_update",
    delete: "workflows_destroy",
  };
  protected loadedIdNames = WORKFLOW_ID_NAMES;

  public states: WorkflowStates;
  public transitions: WorkflowTransitions;

  constructor(transport: V2Transport) {
    super(transport);
    this.states = new WorkflowStates(transport);
    this.transitions = new WorkflowTransitions(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WorkflowNavigation> {
    const ids = meta.ids as [string, string, string];
    return {
      states: () => owned(this.states, ids, meta.idNames),
      transitions: () => owned(this.transitions, ids, meta.idNames),
    };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkflowField, "all"> & keyof Workflow>(
    slug: string,
    project: string,
    params: ListWorkflowsParams & { fields: readonly F[] }
  ): Promise<Page<LoadedWorkflowRow<Pick<Workflow, F | "id">>>>;
  list(slug: string, project: string, params?: ListWorkflowsParams): Promise<Page<LoadedWorkflow>>;
  async list(slug: string, project: string, params?: ListWorkflowsParams): Promise<Page<LoadedWorkflow>> {
    const page = await this.doList({ slug, project_id: project }, params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every workflow in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<WorkflowField, "all"> & keyof Workflow>(
    slug: string,
    project: string,
    params: ListWorkflowsParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedWorkflowRow<Pick<Workflow, F | "id">>>;
  iterate(slug: string, project: string, params?: ListWorkflowsParams): AsyncGenerator<LoadedWorkflow>;
  iterate(slug: string, project: string, params?: ListWorkflowsParams): AsyncGenerator<LoadedWorkflow> {
    return this.loadIterate(
      this.doIterate({ slug, project_id: project }, params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<WorkflowField, "all"> & keyof Workflow>(
    slug: string,
    project: string,
    workflow: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedWorkflowRow<Pick<Workflow, F | "id">>>;
  retrieve(slug: string, project: string, workflow: string, params?: WorkflowShapeParams): Promise<LoadedWorkflow>;
  async retrieve(
    slug: string,
    project: string,
    workflow: string,
    params?: WorkflowShapeParams
  ): Promise<LoadedWorkflow> {
    const row = await this.doRetrieve({ slug, project_id: project, pk: workflow }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  create<F extends Exclude<WorkflowField, "all"> & keyof Workflow>(
    slug: string,
    project: string,
    data: CreateWorkflow,
    params: WorkflowShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkflowRow<Pick<Workflow, F | "id">>>;
  create(slug: string, project: string, data: CreateWorkflow, params?: WorkflowShapeParams): Promise<LoadedWorkflow>;
  async create(
    slug: string,
    project: string,
    data: CreateWorkflow,
    params?: WorkflowShapeParams
  ): Promise<LoadedWorkflow> {
    const row = await this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<WorkflowField, "all"> & keyof Workflow>(
    slug: string,
    project: string,
    workflow: string,
    data: UpdateWorkflow,
    params: WorkflowShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkflowRow<Pick<Workflow, F | "id">>>;
  update(
    slug: string,
    project: string,
    workflow: string,
    data: UpdateWorkflow,
    params?: WorkflowShapeParams
  ): Promise<LoadedWorkflow>;
  async update(
    slug: string,
    project: string,
    workflow: string,
    data: UpdateWorkflow,
    params?: WorkflowShapeParams
  ): Promise<LoadedWorkflow> {
    const row = await this.doUpdate(
      data,
      { slug, project_id: project, pk: workflow },
      params as Record<string, unknown>
    );
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, workflow: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: workflow });
  }
}

export { WorkflowStates } from "./States";
export { WorkflowTransitions } from "./Transitions";
export type {
  ListWorkflowStatesParams,
  WorkflowStateField,
  WorkflowStateOrderBy,
  WorkflowStateShapeParams,
} from "./States";
export type { ListWorkflowTransitionsParams, WorkflowTransitionField, WorkflowTransitionOrderBy } from "./Transitions";
