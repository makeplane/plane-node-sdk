/** A project workflow graph. Every field except `id` is optional. */
export interface Workflow {
  id: string;
  name?: string | null;
  description?: string | null;
  is_active?: boolean;
  is_default?: boolean;
  /** Work item type ids this workflow applies to. */
  work_item_type_ids?: string[];
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name` is required by the API. */
export interface CreateWorkflow {
  name: string;
  description?: string | null;
  is_active?: boolean;
  work_item_type_ids?: string[];
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateWorkflow = Partial<CreateWorkflow>;
