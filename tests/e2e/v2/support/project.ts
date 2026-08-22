import { PlaneClient } from "../../../../src/client/plane-client";

export interface TestProject {
  id: string;
  identifier: string;
}

/** The exact prefix `createProject` gives every disposable project's `name` — the pre-flight sweep matches on it. */
export const TEST_PROJECT_NAME_PREFIX = "SDK v2 Node IT ";

/** The server's own cap — enforced client-side too so a bad build fails fast, not with a 400. */
const IDENTIFIER_MAX_LEN = 10;
/**
 * 3 random chars + 3 per-call counter chars — unique within a process, and unlikely to repeat across runs.
 */
const ENTROPY_LEN = 6;
const COUNTER_WIDTH = 3;
const COUNTER_MODULUS = 36 ** COUNTER_WIDTH;
const PREFIX = "N"; // distinguishes this SDK's disposable test projects from the Python suite's ("I"-prefixed).

let callCount = 0;

/** Base-36, zero-padded, wrapping at `COUNTER_MODULUS` — see `ENTROPY_LEN`'s doc comment. */
function nextCounter(): string {
  callCount = (callCount + 1) % COUNTER_MODULUS;
  return callCount.toString(36).padStart(COUNTER_WIDTH, "0");
}

/**
 * Reserves a fixed-width entropy suffix (random tail + per-process counter) that's never truncated; the label is truncated instead.
 * A timestamp tail was used before, but 3 base-36 chars of it repeat every ~46 s across runs. Verified in e2e-project-identifier.test.ts.
 */
export function makeProjectIdentifier(label: string): string {
  const randomTail = Math.floor(Math.random() * 36 ** COUNTER_WIDTH)
    .toString(36)
    .padStart(COUNTER_WIDTH, "0");
  const entropy = `${randomTail}${nextCounter()}`.toUpperCase().slice(0, ENTROPY_LEN);
  const labelBudget = Math.max(IDENTIFIER_MAX_LEN - PREFIX.length - entropy.length, 0);
  const truncatedLabel = label
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, labelBudget);
  return `${PREFIX}${truncatedLabel}${entropy}`.slice(0, IDENTIFIER_MAX_LEN);
}

/**
 * No v2 projects resource yet, so setup goes straight through the transport; every project is seeded with 5 default states and no labels.
 */
export async function createProject(client: PlaneClient, workspaceSlug: string, label: string): Promise<TestProject> {
  const identifier = makeProjectIdentifier(label);
  const created = await client.v2.transport.request<{ id: string; identifier: string }>(
    "POST",
    `/workspaces/${workspaceSlug}/projects/`,
    { data: { name: `${TEST_PROJECT_NAME_PREFIX}${label} ${Date.now().toString(36)}`, identifier } }
  );
  return { id: created.id, identifier: created.identifier };
}

export async function deleteProject(client: PlaneClient, workspaceSlug: string, project: TestProject): Promise<void> {
  try {
    await client.v2.transport.request("DELETE", `/workspaces/${workspaceSlug}/projects/${project.id}/`);
  } catch (error) {
    // Best-effort: an already-gone project is fine, but log so a real leak
    // (permissions, rate limiting) doesn't go unnoticed.
    console.warn(`v2 e2e: failed to delete test project ${project.id} (${project.identifier}):`, error);
  }
}

interface ListedProject {
  id: string;
  identifier: string;
  name: string;
  created_at?: string;
}

interface ProjectsPage {
  data: ListedProject[];
  next?: number | null;
}

/**
 * Set above this suite's own worst-case full-run time (~800s) so a live run's own projects are never candidates, but low enough to self-heal soon.
 */
const STALE_PROJECT_THRESHOLD_MS = 30 * 60 * 1000;

/**
 * Deletes this suite's own stale leftover projects (identifier+name prefix, age gate) before a run; the age gate stops concurrent runs deleting each other's live projects.
 */
export async function sweepLeftoverProjects(
  client: PlaneClient,
  workspaceSlug: string,
  /** Injectable clock, `Date.now()` by default — lets a test prove the age gate's boundary deterministically. */
  now: number = Date.now()
): Promise<number> {
  const cutoff = now - STALE_PROJECT_THRESHOLD_MS;
  const leftovers: ListedProject[] = [];
  let offset: number | undefined;
  // Hard cap, not unbounded: a server that never reports `next: null` can't
  // hang the sweep indefinitely.
  for (let page = 0; page < 20; page++) {
    const response = await client.v2.transport.request<ProjectsPage>("GET", `/workspaces/${workspaceSlug}/projects/`, {
      params: offset === undefined ? { per_page: 100 } : { per_page: 100, offset },
    });
    for (const project of response.data) {
      if (!project.identifier?.startsWith(PREFIX) || !project.name?.startsWith(TEST_PROJECT_NAME_PREFIX)) continue;
      // No created_at at all is treated as "not provably stale" (skip, not sweep)
      // — the fail-safe direction is leaving a leftover for one more run to
      // catch, never deleting something that might still be live.
      const createdAtMs = project.created_at ? new Date(project.created_at).getTime() : NaN;
      if (!Number.isNaN(createdAtMs) && createdAtMs < cutoff) {
        leftovers.push(project);
      }
    }
    if (response.next === null || response.next === undefined) break;
    offset = response.next;
  }

  if (leftovers.length === 0) return 0;

  console.warn(
    `v2 e2e pre-flight sweep: deleting ${leftovers.length} leftover test project(s) from a prior run: ` +
      leftovers.map((project) => project.identifier).join(", ")
  );
  for (const project of leftovers) {
    await deleteProject(client, workspaceSlug, { id: project.id, identifier: project.identifier });
  }
  return leftovers.length;
}
