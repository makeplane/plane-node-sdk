import { User } from "./User";

/**
 * A project member — a User with an additional role and role_slug field.
 *
 * Returned by Projects.getMembers(). The role field is the numeric role value
 * (e.g. 20 = Member, 15 = Viewer, 10 = Guest, 5 = Viewer), role_slug is the
 * human-readable equivalent (e.g. "member", "viewer").
 */
export interface ProjectMember extends User {
  role: number | null;
  role_slug: string | null;
}

/**
 * A workspace member — a User with an additional role and role_slug field.
 *
 * Returned by Workspace.getMembers().
 */
export interface WorkspaceMember extends User {
  role: number | null;
  role_slug: string | null;
}

/**
 * Query params for the paginated members-lite endpoints.
 */
export interface ListMembersLiteParams {
  /** Number of results per page */
  per_page?: number;
  /** Pagination cursor from a previous response's next_cursor */
  cursor?: string;
  [key: string]: unknown;
}

/**
 * One role's aggregate membership counts within a workspace.
 */
export interface ProjectRoleDistributionEntry {
  role_id?: string;
  name?: string;
  slug?: string;
  is_system?: boolean;
  level?: number;
  membership_count?: number;
  distinct_member_count?: number;
}

/**
 * Aggregate count of project members by role across a workspace.
 * Counts span all active (non-archived) projects and include both
 * built-in roles (admin, contributor, commenter, guest) and custom roles.
 */
export interface ProjectRoleDistribution {
  total_memberships?: number;
  total_distinct_members?: number;
  roles: ProjectRoleDistributionEntry[];
}
