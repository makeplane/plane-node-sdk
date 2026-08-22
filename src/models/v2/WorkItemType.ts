/** A work item type — project- or workspace-scoped. v2 only reads them plus a small writable surface (rename/describe/enable). */
export interface WorkItemType {
  id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
  /** Managed via {@link WorkItemTypes.markDefault}/`markDefaultWorkspace`, not this resource's write body. */
  is_default?: boolean;
  /** Epic types are system-managed; never settable through this resource. */
  is_epic?: boolean;
  level?: number;
  /** Untyped in the golden (no fixed shape declared for the icon/emoji payload). */
  logo_props?: unknown;
  created_at?: string;
}

/** POST body. `name` required; `logo_props`/`is_default`/`is_epic`/`level` are not writable here. */
export interface CreateWorkItemType {
  name: string;
  description?: string;
  is_active?: boolean;
  external_id?: string | null;
  external_source?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateWorkItemType = Partial<CreateWorkItemType>;

/** Documents the `schema` action's response — writable standard fields plus custom properties, `unknown` shapes. */
export interface WorkItemTypeSchema {
  type_id: string | null;
  type_name: string | null;
  type_description: string | null;
  type_logo_props: unknown;
  fields: unknown;
  custom_fields: unknown;
}

/** Response of `properties.attach`/`attachWorkspace` — the full set of property ids now attached to the type. */
export interface AttachedWorkItemTypeProperties {
  properties: string[];
}
