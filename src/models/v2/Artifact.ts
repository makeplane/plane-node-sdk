/** The golden's `DataModeEnum`. */
export type ArtifactDataMode = "snapshot" | "live";

/** The summary row `create` returns. No `?fields=` support, so nothing is optional. */
export interface Artifact {
  id: string;
  name: string;
  anchor: string | null;
  current_version: number;
  data_mode: string;
  is_published: boolean;
}

/** The full artifact `retrieve` returns, including its `html`. Same "nothing optional" note as {@link Artifact}. */
export interface ArtifactDetail {
  id: string;
  name: string;
  description: string;
  html: string;
  current_version: number;
  data_mode: string;
}

/** POST body. `html` and `name` are required. */
export interface CreateArtifact {
  name: string;
  html: string;
  description?: string;
  prompt?: string;
  project?: string | null;
  data_mode?: ArtifactDataMode;
}

/** The row `publish` returns. */
export interface ArtifactPublishResult {
  anchor: string;
  is_active: boolean;
}

/** PATCH body for the `update` action — `html`/`prompt` only; every field optional. */
export interface UpdateArtifactUpdate {
  html?: string;
  prompt?: string;
}

/** The row the `update` action returns — just enough to confirm the new version landed. */
export interface ArtifactUpdateResult {
  id: string;
  current_version: number;
  data_mode: string;
}
