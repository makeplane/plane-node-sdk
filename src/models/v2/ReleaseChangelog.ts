/** A release's changelog — a singleton, auto-created empty on first `GET`. */
export interface ReleaseChangelog {
  id: string;
  changelog_id?: string;
  description_html?: string | null;
  description_json?: unknown;
  release_id?: string;
}

/** PATCH body. There is no create — the row is auto-created empty by `GET`. */
export interface UpdateReleaseChangelog {
  description_html?: string;
  description_json?: unknown;
}
