import { MultipleMatchesFoundError, NoMatchFoundError } from "../../errors/PlaneApiError";
import { Page } from "../../models/v2/common";
import {
  WorkItemRelationDefinition,
  UpdateWorkItemRelationDefinition,
  CreateWorkItemRelationDefinition,
} from "../../models/v2/WorkItemRelationDefinition";
import { FIELDS } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type WorkItemRelationDefinitionField = (typeof FIELDS)["work_item_relation_definitions_list"][number];

export interface ListWorkItemRelationDefinitionsParams {
  fields?: readonly WorkItemRelationDefinitionField[];
  offset?: number;
  per_page?: number;
  count?: boolean;
  // No `order_by`/`search`/`paginate` — the golden gives this operation none of the three.
}

/** `?fields=` on a single-row read or write. */
export interface WorkItemRelationDefinitionFieldsParams {
  fields?: readonly WorkItemRelationDefinitionField[];
}

/** Custom work-item relation types, workspace-scoped, gated on CUSTOM_RELATIONS. Seeded defaults can't be edited/deleted. */
export class WorkItemRelationDefinitions extends V2Resource<
  WorkItemRelationDefinition,
  CreateWorkItemRelationDefinition,
  UpdateWorkItemRelationDefinition
> {
  protected path = "/workspaces/{slug}/work-item-relation-definitions/";
  protected operations: Record<string, OperationId> = {
    list: "work_item_relation_definitions_list",
    retrieve: "work_item_relation_definitions_retrieve",
    create: "work_item_relation_definitions_create",
    update: "work_item_relation_definitions_partial_update",
    delete: "work_item_relation_definitions_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemRelationDefinitionField, "all"> & keyof WorkItemRelationDefinition>(
    slug: string,
    params: ListWorkItemRelationDefinitionsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemRelationDefinition, F | "id">>>;
  list(slug: string, params?: ListWorkItemRelationDefinitionsParams): Promise<Page<WorkItemRelationDefinition>>;
  list(slug: string, params?: ListWorkItemRelationDefinitionsParams): Promise<Page<WorkItemRelationDefinition>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every relation definition, following pages automatically. */
  iterate<F extends Exclude<WorkItemRelationDefinitionField, "all"> & keyof WorkItemRelationDefinition>(
    slug: string,
    params: ListWorkItemRelationDefinitionsParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemRelationDefinition, F | "id">>;
  iterate(slug: string, params?: ListWorkItemRelationDefinitionsParams): AsyncGenerator<WorkItemRelationDefinition>;
  iterate(slug: string, params?: ListWorkItemRelationDefinitionsParams): AsyncGenerator<WorkItemRelationDefinition> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemRelationDefinitionField, "all"> & keyof WorkItemRelationDefinition>(
    slug: string,
    definition: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemRelationDefinition, F | "id">>;
  retrieve(
    slug: string,
    definition: string,
    params?: WorkItemRelationDefinitionFieldsParams
  ): Promise<WorkItemRelationDefinition>;
  retrieve(
    slug: string,
    definition: string,
    params?: WorkItemRelationDefinitionFieldsParams
  ): Promise<WorkItemRelationDefinition> {
    return this.doRetrieve({ slug, pk: definition }, params as Record<string, unknown>);
  }

  /** The one relation definition with this name; throws if none or several match (filters client-side). */
  async findByName(slug: string, name: string): Promise<WorkItemRelationDefinition> {
    const matches: WorkItemRelationDefinition[] = [];
    for await (const row of this.iterate(slug)) {
      if (row.name === name) matches.push(row);
    }
    if (matches.length === 0) {
      throw new NoMatchFoundError(`No ${this.constructor.name} matched name=${JSON.stringify(name)}.`);
    }
    if (matches.length > 1) {
      throw new MultipleMatchesFoundError(
        `Multiple rows matched name=${JSON.stringify(name)}; use the id instead, or list to see every match.`
      );
    }
    return matches[0];
  }

  create<F extends Exclude<WorkItemRelationDefinitionField, "all"> & keyof WorkItemRelationDefinition>(
    slug: string,
    data: CreateWorkItemRelationDefinition,
    params: WorkItemRelationDefinitionFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemRelationDefinition, F | "id">>;
  create(
    slug: string,
    data: CreateWorkItemRelationDefinition,
    params?: WorkItemRelationDefinitionFieldsParams
  ): Promise<WorkItemRelationDefinition>;
  create(
    slug: string,
    data: CreateWorkItemRelationDefinition,
    params?: WorkItemRelationDefinitionFieldsParams
  ): Promise<WorkItemRelationDefinition> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update<F extends Exclude<WorkItemRelationDefinitionField, "all"> & keyof WorkItemRelationDefinition>(
    slug: string,
    definition: string,
    data: UpdateWorkItemRelationDefinition,
    params: WorkItemRelationDefinitionFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemRelationDefinition, F | "id">>;
  update(
    slug: string,
    definition: string,
    data: UpdateWorkItemRelationDefinition,
    params?: WorkItemRelationDefinitionFieldsParams
  ): Promise<WorkItemRelationDefinition>;
  update(
    slug: string,
    definition: string,
    data: UpdateWorkItemRelationDefinition,
    params?: WorkItemRelationDefinitionFieldsParams
  ): Promise<WorkItemRelationDefinition> {
    return this.doUpdate(data, { slug, pk: definition }, params as Record<string, unknown>);
  }

  delete(slug: string, definition: string): Promise<void> {
    return this.doDelete({ slug, pk: definition });
  }
}
