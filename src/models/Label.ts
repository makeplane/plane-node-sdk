export interface Label {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  name: string;
  description: string;
  color: string;
  sort_order: number;
  external_source: string;
  external_id: string;
  created_by: string;
  updated_by: string;
  workspace: string;
  project: string;
  parent: string;
}
