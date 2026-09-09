/** Options of an OPTION-typed property — same shape at project or workspace scope. */

/** Every field except `id` is optional — see {@link WorkItemProperty} for why. */
export interface WorkItemPropertyOptionLite {
  id: string;
  description?: string;
  external_id?: string | null;
  external_source?: string | null;
  is_default?: boolean;
  name?: string;
  sort_order?: number;
}

/** POST body. `name` is required by the API. */
export interface CreateWorkItemPropertyOption {
  name: string;
  description?: string;
  external_id?: string | null;
  external_source?: string | null;
  is_default?: boolean;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateWorkItemPropertyOption = Partial<CreateWorkItemPropertyOption>;

/** One option seeded inline on `CreateWorkItemProperty.options` on create — write-only, no `id`/`sort_order`. */
export interface WorkItemPropertyOptionSeed {
  name: string;
  description?: string;
  external_id?: string | null;
  external_source?: string | null;
  is_default?: boolean;
}
