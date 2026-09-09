/** A custom work-item relation type (workspace-scoped) — the inward/outward label pair; seeded defaults can't be edited/deleted. */
export interface WorkItemRelationDefinition {
  id: string;
  name?: string;
  description?: string;
  inward?: string;
  outward?: string;
  color?: string;
  is_active?: boolean;
  /** System-managed — seeded defaults only. Not present on {@link CreateWorkItemRelationDefinition}. */
  is_default?: boolean;
  logo_props?: unknown;
  sort_order?: number;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body. `name`/`inward`/`outward` are required; `is_default` is not writable. */
export interface CreateWorkItemRelationDefinition {
  name: string;
  inward: string;
  outward: string;
  description?: string;
  color?: string;
  is_active?: boolean;
  logo_props?: unknown;
  sort_order?: number;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateWorkItemRelationDefinition = Partial<CreateWorkItemRelationDefinition>;
