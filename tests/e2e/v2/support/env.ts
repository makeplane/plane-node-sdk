/**
 * Reads `v2Env()` once at module scope so missing credentials skip cleanly; prefers `TEST_WORKSPACE_SLUG` (the name CI passes).
 */

export interface V2Env {
  ready: boolean;
  baseUrl: string;
  apiKey: string;
  workspaceSlug: string;
}

export function v2Env(): V2Env {
  const baseUrl = process.env.PLANE_BASE_URL;
  const apiKey = process.env.PLANE_API_KEY;
  const workspaceSlug = process.env.TEST_WORKSPACE_SLUG ?? process.env.WORKSPACE_SLUG;

  return {
    ready: Boolean(baseUrl && apiKey && workspaceSlug),
    baseUrl: baseUrl ?? "",
    apiKey: apiKey ?? "",
    workspaceSlug: workspaceSlug ?? "",
  };
}
