/** One role's membership counts within a workspace's project-role distribution. */
export interface ProjectRoleDistributionEntry {
  role_id: string | null;
  name: string | null;
  slug: string | null;
  level: number | null;
  is_system: boolean | null;
  membership_count: number;
  distinct_member_count: number;
}

/** Workspace-wide project-role distribution from `GET /workspaces/{slug}/project-role-distribution/`; every field required. */
export interface ProjectRoleDistribution {
  roles: ProjectRoleDistributionEntry[];
  total_memberships: number;
  total_distinct_members: number;
}
