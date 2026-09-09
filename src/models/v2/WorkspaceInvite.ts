/** A workspace invitation (pending or responded to). No PATCH — accepted/declined by the invitee, not edited by the inviter. */
export interface WorkspaceInvite {
  id: string;
  email?: string;
  role?: string | null;
  message?: string | null;
  accepted?: boolean;
  responded_at?: string | null;
  created_at?: string;
  created_by_id?: string | null;
}

/** POST body for a single invite. `role` defaults to `"member"` server-side when omitted. */
export interface CreateWorkspaceInvite {
  email: string;
  role?: string;
  message?: string | null;
}

/** POST body for the bulk-invite action — up to 100 emails, one shared role/message for all. */
export interface BulkCreateWorkspaceInvites {
  emails: string[];
  role?: string;
  message?: string | null;
}
