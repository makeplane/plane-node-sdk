/**
 * ReleaseLabel model interfaces
 * Labels categorize releases across the workspace (e.g. by team or platform).
 * Names are unique per workspace.
 *
 * The API serializer exposes exactly these fields.
 */
export interface ReleaseLabel {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  workspace: string;
}

export interface CreateReleaseLabel {
  name: string;
  color?: string;
  sort_order?: number;
}

export type UpdateReleaseLabel = Partial<CreateReleaseLabel>;

export interface ListReleaseLabelsParams {
  per_page?: number;
  cursor?: string;
  [key: string]: any;
}
