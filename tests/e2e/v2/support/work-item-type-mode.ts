import { PlaneClient } from "../../../../src/client/plane-client";

/**
 * Work item types are governed at either the project or workspace level, never both; writing to the wrong endpoint 409s with a stable code.
 */
export type WorkItemTypeMode = "project" | "workspace";

export async function resolveWorkItemTypeMode(client: PlaneClient, workspaceSlug: string): Promise<WorkItemTypeMode> {
  const features = await client.v2.transport.request<{ is_work_item_types_enabled: boolean }>(
    "GET",
    `/workspaces/${workspaceSlug}/features/`
  );
  return features.is_work_item_types_enabled ? "workspace" : "project";
}

/**
 * Guard for a mode-only test: logs the condition, returns `true` when `actual` isn't `required` (caller should `return` immediately).
 */
export function skipUnlessMode(actual: WorkItemTypeMode, required: WorkItemTypeMode, reason: string): boolean {
  if (actual !== required) {
    console.warn(`v2 live suite: skipping — mode is "${actual}", not "${required}". ${reason}`);
    return true;
  }
  return false;
}
