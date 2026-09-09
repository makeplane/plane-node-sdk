/** `unreleased` | `released` | `cancelled` — the golden's `ReleaseStatusEnum`. */
export type ReleaseStatus = "unreleased" | "released" | "cancelled";

/** A release. `label_ids`/`lead_id`/`tag_id` are id-only — no readable-name write field exists for any of them. */
export interface Release {
  id: string;
  created_at?: string;
  created_by_id?: string | null;
  description_html?: string | null;
  description_id?: string;
  external_id?: string | null;
  external_source?: string | null;
  is_latest?: boolean;
  is_prerelease?: boolean;
  label_ids?: string[];
  lead_id?: string | null;
  name?: string;
  release_date?: string | null;
  status?: ReleaseStatus;
  tag_id?: string | null;
  target_date?: string | null;
}

/** POST body. `name` is required by the API. */
export interface CreateRelease {
  name: string;
  description_html?: string;
  description_json?: unknown;
  external_id?: string | null;
  external_source?: string | null;
  is_latest?: boolean;
  is_prerelease?: boolean;
  lead_id?: string | null;
  release_date?: string | null;
  status?: ReleaseStatus;
  tag_id?: string | null;
  target_date?: string | null;
}

/** PATCH body — every field optional. v2 has no PUT. */
export type UpdateRelease = Partial<CreateRelease>;
