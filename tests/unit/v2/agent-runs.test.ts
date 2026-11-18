import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { AgentRuns } from "../../../src/api/v2/AgentRuns";
import { AgentRunActivities } from "../../../src/api/v2/AgentRuns/Activities";
import { WorkspaceAgentRunActivities } from "../../../src/api/v2/AgentRuns/WorkspaceActivities";
import { Workspaces } from "../../../src/api/v2/Workspaces";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const SLUG = "acme";
const RUN = "run-1";

const transport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const makeRuns = () => new AgentRuns(transport());
const makeActivities = () => new AgentRunActivities(transport());
const makeFeed = () => new WorkspaceAgentRunActivities(transport());

const runs = `/api/v2/workspaces/${SLUG}/runs/`;
const activities = `${runs}${RUN}/activities/`;
const feed = `${runs}activities/`;
const offsetPage = (data: unknown[]) => ({ data, pagination: { style: "offset" } });

afterEach(() => nock.cleanAll());

describe("AgentRuns (v2)", () => {
  it("lists runs with every runs_list filter, joining status__in", async () => {
    const scope = nock(BASE)
      .get(runs)
      .query({
        agent_user_id: "bot-1",
        project_id: "p1",
        status: "in_progress",
        status__in: "created,in_progress,awaiting",
        trigger_type: "mention",
        type: "comment_thread",
        updated_at__gte: "2026-11-10T00:00:00Z",
        work_item_id: "wi-1",
        order_by: "-updated_at",
        expand: "agent_user,work_item",
        per_page: "50",
      })
      .reply(200, offsetPage([{ id: RUN, status: "in_progress" }]));

    const page = await makeRuns().list(SLUG, {
      agent_user_id: "bot-1",
      project_id: "p1",
      status: "in_progress",
      status__in: ["created", "in_progress", "awaiting"],
      trigger_type: "mention",
      type: "comment_thread",
      updated_at__gte: "2026-11-10T00:00:00Z",
      work_item_id: "wi-1",
      order_by: "-updated_at",
      expand: ["agent_user", "work_item"],
      per_page: 50,
    });

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].status).toBe("in_progress");
  });

  it("iterates a cursor walk until has_more is false", async () => {
    nock(BASE)
      .get(runs)
      .query({ paginate: "cursor", updated_at__gte: "2026-11-10T00:00:00Z" })
      .reply(200, { data: [{ id: "r1" }], pagination: { style: "cursor" }, has_more: true, next_cursor: "c2" });
    nock(BASE)
      .get(runs)
      .query({ paginate: "cursor", updated_at__gte: "2026-11-10T00:00:00Z", cursor: "c2" })
      .reply(200, { data: [{ id: "r2" }], pagination: { style: "cursor" }, has_more: false, next_cursor: null });

    const seen: string[] = [];
    for await (const run of makeRuns().iterate(SLUG, { paginate: "cursor", updated_at__gte: "2026-11-10T00:00:00Z" })) {
      seen.push(run.id);
    }

    expect(seen).toEqual(["r1", "r2"]);
  });

  it("retrieves a run with fields and expand, narrowing the row type", async () => {
    const scope = nock(BASE)
      .get(`${runs}${RUN}/`)
      .query({ fields: "status,work_item_id", expand: "comment,source_comment" })
      .reply(200, { id: RUN, status: "awaiting", work_item_id: "wi-1" });

    const run = await makeRuns().retrieve(SLUG, RUN, {
      fields: ["status", "work_item_id"] as const,
      expand: ["comment", "source_comment"],
    });

    expect(scope.isDone()).toBe(true);
    expect(run.status).toBe("awaiting");
    // @ts-expect-error `summary` was not requested
    expect(run.summary).toBeUndefined();
  });

  it("creates a run from an agent slug and a top-level comment", async () => {
    const write = { agent_slug: "poem-agent", comment_id: "c1", title: "Write a poem" };
    const scope = nock(BASE).post(runs, write).reply(201, { id: RUN, comment_id: "c1", status: "created" });

    const run = await makeRuns().create(SLUG, write);

    expect(scope.isDone()).toBe(true);
    expect(run.status).toBe("created");
  });

  it("settles a run with PATCH (the agent's update), never PUT", async () => {
    const patch = { status: "completed" as const, summary: "A poem", token_usage: { input: 10, output: 20 } };
    const scope = nock(BASE)
      .patch(`${runs}${RUN}/`, patch)
      .reply(200, { id: RUN, status: "completed", summary: "A poem" });

    const run = await makeRuns().update(SLUG, RUN, patch);

    expect(scope.isDone()).toBe(true);
    expect(run.status).toBe("completed");
  });

  it("stops a run with a bodyless POST to {pk}/stop/", async () => {
    const scope = nock(BASE)
      .post(`${runs}${RUN}/stop/`, (body) => body === undefined || body === "" || Object.keys(body).length === 0)
      .query({ fields: "status" })
      .reply(200, { id: RUN, status: "stopping" });

    const run = await makeRuns().stop(SLUG, RUN, { fields: ["status"] as const });

    expect(scope.isDone()).toBe(true);
    expect(run.status).toBe("stopping");
  });

  it("surfaces a 409 from stopping an ended run as a PlaneApiError", async () => {
    nock(BASE)
      .post(`${runs}${RUN}/stop/`)
      .reply(
        409,
        { type: "about:blank", title: "Conflict", status: 409, detail: "The run has already ended.", code: "conflict" },
        { "Content-Type": "application/problem+json" }
      );

    await expect(makeRuns().stop(SLUG, RUN)).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 409 });
  });

  it("has no delete: a run is settled, not removed", () => {
    expect("delete" in makeRuns()).toBe(false);
  });

  it("rejects an unknown order_by and an unknown expand before making a request", async () => {
    await expect(makeRuns().list(SLUG, { order_by: "status" as never })).rejects.toThrow(
      /Unknown order_by 'status' for runs_list/
    );
    await expect(makeRuns().retrieve(SLUG, RUN, { expand: ["actor" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for runs_retrieve: actor/
    );
  });

  it("exposes .activities as a sub-resource instance", () => {
    expect(makeRuns().activities).toBeInstanceOf(AgentRunActivities);
  });
});

describe("navigable agent run rows (v2)", () => {
  it("reaches a fetched run's activity log without repeating either id", async () => {
    nock(BASE).get(`${runs}${RUN}/`).reply(200, { id: RUN });
    const scope = nock(BASE)
      .get(activities)
      .reply(200, offsetPage([{ id: "a1", type: "thought" }]));

    const run = await makeRuns().retrieve(SLUG, RUN);
    const page = await run.activities.list();

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].type).toBe("thought");
  });

  it("reaches the activity log off a created, a listed, an updated and a stopped run too", async () => {
    nock(BASE).post(runs).reply(201, { id: RUN });
    nock(BASE)
      .get(runs)
      .reply(200, offsetPage([{ id: RUN }]));
    nock(BASE).patch(`${runs}${RUN}/`).reply(200, { id: RUN });
    nock(BASE).post(`${runs}${RUN}/stop/`).reply(200, { id: RUN, status: "stopping" });
    const scope = nock(BASE).get(activities).times(4).reply(200, offsetPage([]));

    const agentRuns = makeRuns();
    const created = await agentRuns.create(SLUG, { agent_slug: "poem-agent", comment_id: "c1" });
    const listed = (await agentRuns.list(SLUG)).data[0];
    const updated = await agentRuns.update(SLUG, RUN, { title: "t" });
    const stopped = await agentRuns.stop(SLUG, RUN);
    for (const row of [created, listed, updated, stopped]) {
      await row.activities.list();
    }

    expect(scope.isDone()).toBe(true);
  });

  it("posts an activity through a fetched run", async () => {
    const body = { type: "prompt" as const, content: { type: "prompt" as const, body: "<p>Make it rhyme</p>" } };
    nock(BASE).get(`${runs}${RUN}/`).reply(200, { id: RUN });
    const scope = nock(BASE).post(activities, body).reply(201, { id: "a1", type: "prompt", comment_id: "c2" });

    const run = await makeRuns().retrieve(SLUG, RUN);
    const created = await run.activities.create(body);

    expect(scope.isDone()).toBe(true);
    expect(created.comment_id).toBe("c2");
  });
});

describe("AgentRunActivities (v2)", () => {
  it("lists one run's activities with type__in, signal, created_at__gte and expand", async () => {
    const scope = nock(BASE)
      .get(activities)
      .query({
        type__in: "response,error",
        signal: "stop",
        created_at__gte: "2026-11-10T00:00:00Z",
        ephemeral: "false",
        expand: "actor",
        order_by: "created_at",
      })
      .reply(200, offsetPage([{ id: "a1", type: "response" }]));

    const page = await makeActivities().list(SLUG, RUN, {
      type__in: ["response", "error"],
      signal: "stop",
      created_at__gte: "2026-11-10T00:00:00Z",
      ephemeral: false,
      expand: ["actor"],
      order_by: "created_at",
    });

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].type).toBe("response");
  });

  it("retrieves one activity, narrowing on fields", async () => {
    const scope = nock(BASE)
      .get(`${activities}a1/`)
      .query({ fields: "type,content_metadata" })
      .reply(200, { id: "a1", type: "action", content_metadata: { step: 1 } });

    const activity = await makeActivities().retrieve(SLUG, RUN, "a1", {
      fields: ["type", "content_metadata"] as const,
    });

    expect(scope.isDone()).toBe(true);
    expect(activity.type).toBe("action");
    // @ts-expect-error `content` was not requested
    expect(activity.content).toBeUndefined();
  });

  it("posts an agent's action activity with its typed content", async () => {
    const body = {
      type: "action" as const,
      content: { type: "action" as const, action: "search", parameters: { query: "rhymes" } },
      content_metadata: { step: 1 },
      ephemeral: true,
    };
    const scope = nock(BASE)
      .post(activities, body)
      .reply(201, { id: "a2", ...body });

    const created = await makeActivities().create(SLUG, RUN, body);

    expect(scope.isDone()).toBe(true);
    expect(created.ephemeral).toBe(true);
  });

  it("offers no update or delete: an activity is a record", () => {
    const resource = makeActivities();
    expect("update" in resource).toBe(false);
    expect("delete" in resource).toBe(false);
  });
});

describe("WorkspaceAgentRunActivities (v2) — the cross-run feed", () => {
  it("lists the feed at /runs/activities/, narrowed to one run's stop signals", async () => {
    const scope = nock(BASE)
      .get(feed)
      .query({ agent_run_id: RUN, signal: "stop", type: "prompt" })
      .reply(200, offsetPage([{ id: "a1", agent_run_id: RUN, type: "prompt", signal: "stop" }]));

    const page = await makeFeed().list(SLUG, { agent_run_id: RUN, signal: "stop", type: "prompt" });

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].signal).toBe("stop");
  });

  it("iterates the feed with a keyset cursor and a created_at__gte watermark", async () => {
    nock(BASE)
      .get(feed)
      .query({ paginate: "cursor", per_page: "2", created_at__gte: "2026-11-10T00:00:00Z" })
      .reply(200, {
        data: [{ id: "a1" }, { id: "a2" }],
        pagination: { style: "cursor" },
        has_more: true,
        next_cursor: "n2",
      });
    nock(BASE)
      .get(feed)
      .query({ paginate: "cursor", per_page: "2", created_at__gte: "2026-11-10T00:00:00Z", cursor: "n2" })
      .reply(200, { data: [{ id: "a3" }], pagination: { style: "cursor" }, has_more: false, next_cursor: null });

    const seen: string[] = [];
    for await (const activity of makeFeed().iterate(SLUG, {
      paginate: "cursor",
      per_page: 2,
      created_at__gte: "2026-11-10T00:00:00Z",
    })) {
      seen.push(activity.id);
    }

    expect(seen).toEqual(["a1", "a2", "a3"]);
  });

  it("rejects an order_by the feed does not offer", async () => {
    await expect(makeFeed().list(SLUG, { order_by: "-updated_at" as never })).rejects.toThrow(
      /Unknown order_by '-updated_at' for workspace_run_activities_list/
    );
  });
});

describe("workspace attachment (v2)", () => {
  it("attaches runs and the cross-run feed to v2.workspaces", () => {
    const workspaces = new Workspaces(transport());
    expect(workspaces.agentRuns).toBeInstanceOf(AgentRuns);
    expect(workspaces.agentRunActivities).toBeInstanceOf(WorkspaceAgentRunActivities);
  });

  it("reaches runs and the feed from a fetched workspace row", async () => {
    nock(BASE).get(`/api/v2/workspaces/${SLUG}/`).reply(200, { id: "ws-1", slug: SLUG });
    const runsScope = nock(BASE)
      .get(runs)
      .reply(200, offsetPage([{ id: RUN }]));
    const feedScope = nock(BASE).get(feed).reply(200, offsetPage([]));
    const activitiesScope = nock(BASE).get(activities).reply(200, offsetPage([]));

    const workspace = await new Workspaces(transport()).retrieve(SLUG);
    const page = await workspace.agentRuns.list();
    await workspace.agentRunActivities.list();
    await page.data[0].activities.list();

    expect(runsScope.isDone()).toBe(true);
    expect(feedScope.isDone()).toBe(true);
    expect(activitiesScope.isDone()).toBe(true);
  });
});
