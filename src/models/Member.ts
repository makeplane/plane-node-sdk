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
