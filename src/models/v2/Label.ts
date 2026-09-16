/** A project label. Read fields are optional for the same reason as states. */
export interface Label {
  id: string;
  name?: string;
  color?: string;
  description?: string;
  parent_id?: string | null;
  sort_order?: number;
  external_id?: string | null;
  external_source?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

export interface CreateLabel {
  name: string;
  color?: string;
  description?: string;
  parent_id?: string | null;
  sort_order?: number;
  external_id?: string | null;
  external_source?: string | null;
}

export type UpdateLabel = Partial<CreateLabel>;
