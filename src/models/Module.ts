
export type ModuleStatusEnum =
  | 'backlog'
  | 'planned'
  | 'in-progress'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface Module {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at: string;
  name: string;
  description?: string;
  description_text?: any;
  description_html?: any;
  start_date?: string;
  target_date?: string;
  status?: ModuleStatusEnum;
  view_props?: any;
  sort_order?: number;
  external_source?: string;
  external_id?: string;
  archived_at?: string;
  logo_props?: any;
  created_by?: string;
  updated_by?: string;
  project: string;
  workspace: string;
  lead?: string;
  members?: string[];
}