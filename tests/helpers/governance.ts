import { HttpError } from "../../src/errors";

/**
 * Detects the 400 `workspace_managed` rejection returned by the backend's
 * `reject_when_workspace_governed` / `reject_when_workspace_types_managed`
 * decorators (or an equivalent plain-text workspace-level-feature refusal),
 * so tests can skip project-scoped fixture creation cleanly — with a clear
 * reason — instead of failing loud when a resource is managed at the
 * workspace level in the target workspace.
 *
 * Returns the server's reason string when it matches, or `null` when the
 * error looks like a genuine failure that should still fail the test.
 */
export function workspaceManagedReason(error: unknown): string | null {
  if (!(error instanceof HttpError) || error.statusCode !== 400) return null;

  const response = error.response as { code?: unknown; error?: unknown; detail?: unknown } | undefined;
  const message = String(response?.error ?? response?.detail ?? "");

  if (response?.code === "workspace_managed") return message || "workspace_managed";
  if (message.toLowerCase().includes("managed at the workspace level")) return message;

  return null;
}
