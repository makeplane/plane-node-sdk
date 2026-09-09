/** Shared sparse membership shape for workspace- and project-scoped members. `role` is a slug from `role_ref`; `null` only for legacy rows. */
export interface ProjectMember {
  id: string;
  member_id?: string;
  role?: string | null;
}

/** Identical shape to {@link ProjectMember} — see that type's doc comment. */
export type WorkspaceMember = ProjectMember;

/** POST body for `project_members_create`. `member_id` is required on create (400 without it); `role` defaults to `"member"`. */
export interface CreateProjectMember {
  member_id: string;
  role?: string;
}

/** PATCH body. `member_id` is immutable on update, so it's omitted here rather than following `Partial<Write>`. */
export interface UpdateProjectMember {
  role?: string;
}

/** Body for `POST workspaces/{slug}/members/remove/` (v1 parity). */
export interface WorkspaceMemberRemoveRequest {
  email: string;
  /** Defaults to `false`. */
  remove_seat?: boolean;
}
