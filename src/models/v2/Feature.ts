/** A workspace's feature flags — one row per workspace, addressed with no id (GET/PATCH land on the collection URL, not a `{pk}` route). */
export interface WorkspaceFeature {
  id: string;
  is_customer_enabled?: boolean;
  is_initiative_enabled?: boolean;
  is_member_project_creation_enabled?: boolean;
  is_pi_enabled?: boolean;
  is_project_grouping_enabled?: boolean;
  is_release_enabled?: boolean;
  is_state_duration_enabled?: boolean;
  is_teams_enabled?: boolean;
  is_wiki_enabled?: boolean;
  is_work_item_types_enabled?: boolean;
  is_workitem_hierarchy_enabled?: boolean;
  work_item_type_default_level?: number;
  created_at?: string;
}

/** PATCH body — every field optional. There is no POST/full write for this singleton. */
export interface UpdateWorkspaceFeature {
  is_customer_enabled?: boolean;
  is_initiative_enabled?: boolean;
  is_member_project_creation_enabled?: boolean;
  is_pi_enabled?: boolean;
  is_project_grouping_enabled?: boolean;
  is_release_enabled?: boolean;
  is_state_duration_enabled?: boolean;
  is_teams_enabled?: boolean;
  is_wiki_enabled?: boolean;
  is_work_item_types_enabled?: boolean;
  is_workitem_hierarchy_enabled?: boolean;
  work_item_type_default_level?: number;
}

/** A project's feature flags — same singleton shape as {@link WorkspaceFeature}, but with no `id` field. */
export interface ProjectFeature {
  is_automated_cycle_enabled?: boolean;
  is_epic_enabled?: boolean;
  is_manually_start_end_cycles_enabled?: boolean;
  is_milestone_enabled?: boolean;
  is_parallel_cycles_enabled?: boolean;
  is_project_updates_enabled?: boolean;
  is_workflow_enabled?: boolean;
}

/** PATCH body — every field optional. There is no POST/full write for this singleton. */
export type UpdateProjectFeature = ProjectFeature;
