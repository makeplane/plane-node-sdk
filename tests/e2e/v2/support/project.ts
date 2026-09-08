import { PlaneClient } from "../../../../src/client/plane-client";
import { LoadedProject } from "../../../../src/api/v2/loaded/Project";

export interface TestProject {
  id: string;
  identifier: string;
  /**
   * The same project as a fetched, navigable row.
   *
   * Kept alongside the two ids on purpose: the flat way in needs `(slug, id)` per call,
   * the loaded-row way in needs this, and a suite that only holds one of them can only
   * exercise one of the two shapes the SDK ships.
   */
  row: LoadedProject;
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
 * Create the suite's disposable project through `v2.projects` — the shipped resource,
 * not the raw transport.
 *
 * This used to POST straight through `transport.request` because there was no v2
 * projects resource to call. There is one now, and going through it means every suite's
 * `beforeAll` is itself a live assertion that `Projects.create`'s URL and request shape
 * are right. That is deliberate: a wrong-but-self-consistent URL is exactly the defect
 * class the unit sweeps cannot see, and setup is the one code path every file runs.
 *
 * Every project is seeded by the server with 5 default states and no labels.
 */
export async function createProject(client: PlaneClient, workspaceSlug: string, label: string): Promise<TestProject> {
  const identifier = makeProjectIdentifier(label);
  const row = await client.v2.projects.create(workspaceSlug, {
    name: `${TEST_PROJECT_NAME_PREFIX}${label} ${Date.now().toString(36)}`,
    identifier,
  });
  if (!row.identifier) {
    throw new Error(`v2 e2e: project create answered no identifier for ${identifier}; cannot key child routes off it.`);
  }
  return { id: row.id, identifier: row.identifier, row };
}

export async function deleteProject(client: PlaneClient, workspaceSlug: string, project: TestProject): Promise<void> {
  try {
    await client.v2.projects.delete(workspaceSlug, project.id);
  } catch (error) {
    // Best-effort: an already-gone project is fine, but log so a real leak
    // (permissions, rate limiting) doesn't go unnoticed.
    console.warn(`v2 e2e: failed to delete test project ${project.id} (${project.identifier}):`, error);
  }
}

/**
 * Set above this suite's own worst-case full-run time (~800s) so a live run's own projects are never candidates, but low enough to self-heal soon.
 */
const STALE_PROJECT_THRESHOLD_MS = 30 * 60 * 1000;

/**
 * Deletes this suite's own stale leftover projects (identifier+name prefix, age gate) before a run; the age gate stops concurrent runs deleting each other's live projects.
 *
 * Pages through `projects.iterate`, which follows whichever envelope the server sends —
 * the hand-rolled offset loop this replaced could only follow the offset one, and
 * silently swept nothing if the deployment defaulted to cursor pagination.
 */
export async function sweepLeftoverProjects(
  client: PlaneClient,
  workspaceSlug: string,
  /** Injectable clock, `Date.now()` by default — lets a test prove the age gate's boundary deterministically. */
  now: number = Date.now()
): Promise<number> {
  const cutoff = now - STALE_PROJECT_THRESHOLD_MS;
  const leftovers: TestProject[] = [];
  // Hard cap, not unbounded: a server that never reports the end of the collection
  // can't hang the sweep indefinitely.
  const MAX_ROWS = 2000;
  let seen = 0;
  for await (const project of client.v2.projects.iterate(workspaceSlug, { per_page: 100 })) {
    if (++seen > MAX_ROWS) break;
    if (!project.identifier?.startsWith(PREFIX) || !project.name?.startsWith(TEST_PROJECT_NAME_PREFIX)) continue;
    // No created_at at all is treated as "not provably stale" (skip, not sweep)
    // — the fail-safe direction is leaving a leftover for one more run to
    // catch, never deleting something that might still be live.
    const createdAtMs = project.created_at ? new Date(project.created_at).getTime() : NaN;
    if (!Number.isNaN(createdAtMs) && createdAtMs < cutoff) {
      leftovers.push({ id: project.id, identifier: project.identifier, row: project });
    }
  }

  if (leftovers.length === 0) return 0;

  console.warn(
    `v2 e2e pre-flight sweep: deleting ${leftovers.length} leftover test project(s) from a prior run: ` +
      leftovers.map((project) => project.identifier).join(", ")
  );
  for (const project of leftovers) {
    await deleteProject(client, workspaceSlug, project);
  }
  return leftovers.length;
}
