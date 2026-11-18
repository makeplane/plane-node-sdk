/**
 * Agent runs, their activities, the cross-run feed, and the comment that marks a run's
 * thread — one run's whole life, driven from both sides.
 *
 * A person (the env's API key) starts the run on a top-level comment, reads it, prompts
 * it and stops it. The agent's own bot user (`TEST_AGENT_ACCESS_TOKEN`) lists its runs,
 * posts its output and settles the run — the half a person is refused. Without
 * `TEST_AGENT_SLUG` the file skips; without the access token the agent-side tests skip
 * and the person-side ones still run.
 *
 * The tests share one run and run in declaration order (Jest runs a file's tests
 * serially), because a run's states are a sequence: it can be stopped once, and only a
 * stopping run can be settled as `stopped`.
 *
 * Sync reads — a cursor walk or a `*__gte` poll — hold back rows stamped in the last 3
 * seconds, so those assertions poll with {@link eventually} rather than reading once.
 */
import { randomUUID } from "node:crypto";
import { PlaneClient } from "../../../src/client/plane-client";
import { LoadedAgentRun } from "../../../src/api/v2/loaded/AgentRun";
import { LoadedWorkItem } from "../../../src/api/v2/loaded/WorkItem";
import { AgentRunActivity } from "../../../src/models/v2/AgentRunActivity";
import { WorkItemComment } from "../../../src/models/v2/WorkItemComment";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const agentSlug = process.env.TEST_AGENT_SLUG ?? "";
const agentToken = process.env.TEST_AGENT_ACCESS_TOKEN ?? "";
const maybe = env.ready && agentSlug ? describe : describe.skip;
const agentIt = agentToken ? it : it.skip;

/** The sync-read hold-back is 3 s; allow a few polls past it. */
const SETTLE_TIMEOUT_MS = 20_000;
const SETTLE_INTERVAL_MS = 1_000;

/** Poll `probe` until it answers something truthy, or fail with the last answer after {@link SETTLE_TIMEOUT_MS}. */
async function eventually<T>(probe: () => Promise<T | undefined | false>, what: string): Promise<T> {
  const deadline = Date.now() + SETTLE_TIMEOUT_MS;
  for (;;) {
    const answer = await probe();
    if (answer) return answer;
    if (Date.now() > deadline) throw new Error(`Timed out after ${SETTLE_TIMEOUT_MS} ms waiting for ${what}.`);
    await new Promise((resolve) => setTimeout(resolve, SETTLE_INTERVAL_MS));
  }
}

async function collect<T>(rows: AsyncGenerator<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const row of rows) out.push(row);
  return out;
}

maybe("v2 agent runs (live)", () => {
  const suite = useV2Project("runs", env);
  let slug: string;
  let bot: PlaneClient;
  let workItem: LoadedWorkItem;
  let launch: WorkItemComment;
  let run: LoadedAgentRun;
  let prompt: AgentRunActivity;
  // A watermark safely before anything this file writes, for the `*__gte` polls.
  const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  beforeAll(async () => {
    slug = suite.workspaceSlug;
    if (agentToken) bot = createV2Client(env, agentToken);
    workItem = await suite.projectRow.workItems.create({ name: uniqueName("runs-target") });
    launch = await workItem.comments.create({ comment_html: "<p>Write a poem about this work item</p>" });
  });

  it("starts a run of the agent, by its slug, on a top-level comment", async () => {
    run = await suite.client.v2.workspaces.agentRuns.create(slug, { agent_slug: agentSlug, comment_id: launch.id });

    expect(run.comment_id).toBe(launch.id);
    expect(run.work_item_id).toBe(workItem.id);
    expect(run.project_id).toBe(suite.projectId);
    expect(run.agent_user_id).toEqual(expect.any(String));
    expect(run.status).toBe("created");
  });

  it("retrieves the run, embedding its comment and work item, and narrows on fields", async () => {
    const runs = suite.client.v2.workspaces.agentRuns;

    const expanded = (await runs.retrieve(slug, run.id, { expand: ["comment", "work_item"] })) as unknown as Record<
      string,
      { id: string }
    >;
    expect(expanded.comment.id).toBe(launch.id);
    expect(expanded.work_item.id).toBe(workItem.id);

    const narrow = await runs.retrieve(slug, run.id, { fields: ["status", "comment_id"] as const });
    expect(Object.keys(narrow).sort()).toEqual(["comment_id", "id", "status"]);
  });

  it("lists the run by work item, and finds it in a cursor walk once the hold-back passes", async () => {
    const runs = suite.client.v2.workspaces.agentRuns;

    const page = await runs.list(slug, { work_item_id: workItem.id, status__in: ["created", "in_progress"] });
    expect(page.data.map((row) => row.id)).toEqual([run.id]);

    const walked = await eventually(async () => {
      const rows = await collect(runs.iterate(slug, { paginate: "cursor", per_page: 50, updated_at__gte: since }));
      return rows.some((row) => row.id === run.id) && rows;
    }, "the run to clear the sync-read hold-back");
    expect(new Set(walked.map((row) => row.id)).size).toBe(walked.length);
  });

  it("marks the launch comment: agent_run_id, ?agent_run_id= and ?expand=agent_run", async () => {
    const page = await workItem.comments.list({ agent_run_id: run.id, expand: ["agent_run"] });

    expect(page.data.map((row) => row.id)).toEqual([launch.id]);
    expect(page.data[0].agent_run_id).toBe(run.id);
    const embedded = (page.data[0] as unknown as { agent_run: Record<string, unknown> }).agent_run;
    expect(Object.keys(embedded).sort()).toEqual(["agent_user_id", "id", "native_agent_id", "status"]);
    expect(embedded.id).toBe(run.id);
  });

  it("takes a person's prompt through a fetched run and mirrors it into the work item thread", async () => {
    const fetched = await suite.client.v2.workspaces.agentRuns.retrieve(slug, run.id);

    prompt = await fetched.activities.create({
      type: "prompt",
      content: { type: "prompt", body: "<p>Make it rhyme</p>" },
    });
    expect(prompt.type).toBe("prompt");
    expect(prompt.agent_run_id).toBe(run.id);
    expect(prompt.comment_id).toEqual(expect.any(String));

    const logged = await fetched.activities.list({ type: "prompt" });
    expect(logged.data.map((row) => row.id)).toContain(prompt.id);

    const one = await suite.client.v2.workspaces.agentRuns.activities.retrieve(slug, run.id, prompt.id, {
      fields: ["type", "content"] as const,
    });
    expect(one.content).toEqual({ type: "prompt", body: "<p>Make it rhyme</p>" });

    const mirrored = await workItem.comments.retrieve(prompt.comment_id!);
    expect(mirrored.id).toBe(prompt.comment_id);
  });

  it("shows the prompt in the cross-run feed, filtered and in a created_at__gte cursor walk", async () => {
    const feed = suite.client.v2.workspaces.agentRunActivities;

    const page = await feed.list(slug, { agent_run_id: run.id, type: "prompt" });
    expect(page.data.map((row) => row.id)).toContain(prompt.id);

    const walked = await eventually(async () => {
      const rows = await collect(
        feed.iterate(slug, { paginate: "cursor", per_page: 50, created_at__gte: since, agent_run_id: run.id })
      );
      return rows.some((row) => row.id === prompt.id) && rows;
    }, "the prompt to clear the sync-read hold-back");
    expect(new Set(walked.map((row) => row.id)).size).toBe(walked.length);
  });

  it("refuses a person's PATCH: settling a run is the agent's", async () => {
    await expect(
      suite.client.v2.workspaces.agentRuns.update(slug, run.id, { summary: "forged" })
    ).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 403 });
  });

  agentIt("lets the agent see its own run, and only its own runs", async () => {
    const own = await bot.v2.workspaces.agentRuns.list(slug, { work_item_id: workItem.id });
    expect(own.data.map((row) => row.id)).toEqual([run.id]);

    const everything = await bot.v2.workspaces.agentRuns.list(slug, { per_page: 100 });
    expect(everything.data.every((row) => row.agent_user_id === run.agent_user_id)).toBe(true);
  });

  agentIt("takes the agent's thought and action, and refuses a prompt from it", async () => {
    const activities = bot.v2.workspaces.agentRuns.activities;

    const thought = await activities.create(slug, run.id, {
      type: "thought",
      content: { type: "thought", body: "Looking for rhymes" },
      ephemeral: true,
    });
    const action = await activities.create(slug, run.id, {
      type: "action",
      content: { type: "action", action: "search", parameters: { query: "rhymes for item" } },
      content_metadata: { step: 1 },
    });
    expect(thought.actor_id).toBe(run.agent_user_id);
    expect(action.content_metadata).toEqual({ step: 1 });

    const mine = await activities.list(slug, run.id, { type__in: ["thought", "action"], expand: ["actor"] });
    expect(mine.data.map((row) => row.id).sort()).toEqual([thought.id, action.id].sort());

    await expect(
      activities.create(slug, run.id, { type: "prompt", content: { type: "prompt", body: "x" } })
    ).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 400 });
  });

  agentIt("refuses stop from the agent: an agent ends its own run another way", async () => {
    await expect(bot.v2.workspaces.agentRuns.stop(slug, run.id)).rejects.toMatchObject<Partial<PlaneApiError>>({
      status: 403,
    });
  });

  it("stops the run for a person, once — a second stop is a 409 — and the stop reaches the feed", async () => {
    const runs = suite.client.v2.workspaces.agentRuns;

    const stopping = await runs.stop(slug, run.id);
    expect(stopping.status).toBe("stopping");
    // The stopped row is navigable like any other.
    expect((await stopping.activities.list({ signal: "stop" })).data).toHaveLength(1);

    await expect(runs.stop(slug, run.id)).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 409 });

    const stops = await suite.client.v2.workspaces.agentRunActivities.list(slug, {
      agent_run_id: run.id,
      signal: "stop",
    });
    expect(stops.data.map((row) => row.type)).toEqual(["prompt"]);
  });

  agentIt("settles the stopped run with the agent's response, then the agent reports completion", async () => {
    await bot.v2.workspaces.agentRuns.activities.create(slug, run.id, {
      type: "response",
      content: { type: "response", body: "<p>Stopped.</p>" },
    });
    const stopped = await bot.v2.workspaces.agentRuns.retrieve(slug, run.id, {
      fields: ["status", "stopped_by_id"] as const,
    });
    expect(stopped.status).toBe("stopped");
    expect(stopped.stopped_by_id).toEqual(expect.any(String));

    const done = await bot.v2.workspaces.agentRuns.update(slug, run.id, {
      status: "completed",
      title: "A poem",
      summary: "Wrote a short poem",
    });
    expect(done.status).toBe("completed");
    expect(done.summary).toBe("Wrote a short poem");
    expect(done.ended_at).toEqual(expect.any(String));
  });

  it("answers an unknown run with a 404", async () => {
    await expect(suite.client.v2.workspaces.agentRuns.retrieve(slug, randomUUID())).rejects.toMatchObject<
      Partial<PlaneApiError>
    >({ status: 404 });
  });
});
