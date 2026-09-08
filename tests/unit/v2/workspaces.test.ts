/**
 * `v2.workspaces` — the root of the flat tree.
 *
 * `GET /workspaces/{slug}/` is a singleton read: the slug in the path is the key, so there
 * is no pk to append. What the fetch answers matters more than the fetch — a navigable row
 * that reaches every workspace-scoped family without the slug being repeated.
 */

import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { V2Namespace } from "../../../src/api/v2";
import { Workspaces } from "../../../src/api/v2/Workspaces";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const DETAIL = `/api/v2/workspaces/${SLUG}/`;

const config = () => new Configuration({ baseUrl: BASE, apiKey: "secret" });
const makeWorkspaces = () => new Workspaces(new V2Transport(config()));

afterEach(() => nock.cleanAll());

describe("Workspaces (v2)", () => {
  it("retrieves a workspace at the singleton detail route — no pk appended", async () => {
    const scope = nock(BASE).get(DETAIL).reply(200, { id: "w1", slug: SLUG, name: "Acme", timezone: "UTC" });

    const workspace = await makeWorkspaces().retrieve(SLUG);

    expect(scope.isDone()).toBe(true);
    expect(workspace.id).toBe("w1");
    expect(workspace.name).toBe("Acme");
  });

  it("is reachable as v2.workspaces", () => {
    expect(new V2Namespace(config()).workspaces).toBeInstanceOf(Workspaces);
  });

  it("validates `fields` against the golden before making the request", async () => {
    await expect(makeWorkspaces().retrieve(SLUG, { fields: ["not_a_field" as never] })).rejects.toThrow(
      /Unknown field\(s\) for workspaces_retrieve: not_a_field/
    );
  });

  it("passes a valid `fields` through", async () => {
    const scope = nock(BASE)
      .get(DETAIL)
      .query({ fields: "name,slug" })
      .reply(200, { id: "w1", slug: SLUG, name: "Acme" });

    await makeWorkspaces().retrieve(SLUG, { fields: ["name", "slug"] as const });

    expect(scope.isDone()).toBe(true);
  });

  describe("the row it answers", () => {
    const fetch = () => {
      nock(BASE).get(DETAIL).reply(200, { id: "w1", slug: SLUG, name: "Acme" });
      return makeWorkspaces().retrieve(SLUG);
    };

    it("reaches a child family with the slug already supplied", async () => {
      const workspace = await fetch();
      const scope = nock(BASE)
        .get(`/api/v2/workspaces/${SLUG}/projects/`)
        .reply(200, { data: [{ id: "p1", identifier: "ENG" }], pagination: { style: "offset" } });

      const page = await workspace.projects.list();

      expect(scope.isDone()).toBe(true);
      expect(page.data[0].id).toBe("p1");
    });

    it("chains: a workspace reaches a project, and that project reaches its states", async () => {
      // The whole point of the root. Two ids, neither of them typed twice.
      const workspace = await fetch();
      nock(BASE).get(`/api/v2/workspaces/${SLUG}/projects/ENG/`).reply(200, { id: "p1", identifier: "ENG" });
      const states = nock(BASE)
        .get(`/api/v2/workspaces/${SLUG}/projects/ENG/states/`)
        .reply(200, { data: [{ id: "s1", name: "Todo" }], pagination: { style: "offset" } });

      const project = await workspace.projects.retrieve("ENG");
      const page = await project.states.list();

      expect(states.isDone()).toBe(true);
      expect(page.data[0].name).toBe("Todo");
    });

    it("addresses children by the slug, never the UUID id", async () => {
      // `/workspaces/<uuid>/...` is a well-formed URL pointing at nothing: the segment
      // takes the slug. `rowId` prefers it, which is why this is asserted on the id the
      // child URL was built with rather than on the row.
      const workspace = await fetch();

      expect(workspace.$loaded.ids).toEqual([SLUG]);
      expect(workspace.$loaded.idNames).toEqual(["slug"]);
    });

    it("still addresses children by the slug when `fields` projected it away", async () => {
      // The server honours the projection, so the row comes back without `slug` — and every
      // child URL would be `/workspaces/undefined/...`. The slug the caller passed is the
      // value the row was just fetched by, so it is filled back in.
      nock(BASE).get(DETAIL).query({ fields: "name" }).reply(200, { id: "w1", name: "Acme" });
      const workspace = await makeWorkspaces().retrieve(SLUG, { fields: ["name"] as const });

      expect(workspace.$loaded.ids).toEqual([SLUG]);
      // Filling it in does not widen what was requested: presence still reflects `fields`.
      expect(workspace.$loaded.present.has("slug")).toBe(false);
      expect(workspace.$loaded.present.has("name")).toBe(true);
    });

    it("keeps navigation off the plain object shape", async () => {
      const workspace = await fetch();

      expect(Object.keys(workspace).sort()).toEqual(["id", "name", "slug"]);
      expect(JSON.parse(JSON.stringify(workspace))).toEqual({ id: "w1", slug: SLUG, name: "Acme" });
    });
  });

  it("reaches the wiki and group-sync grouping nodes flat, off the root", async () => {
    // Neither is a `V2Resource`, so neither is a navigation property on a fetched row —
    // they are reached off the resource and take the slug per call, like any flat method.
    const scope = nock(BASE)
      .get(`/api/v2/workspaces/${SLUG}/pages/`)
      .reply(200, { data: [{ id: "pg1" }], pagination: { style: "offset" } });

    const workspaces = makeWorkspaces();
    await workspaces.wiki.pages.list(SLUG);

    expect(scope.isDone()).toBe(true);
    expect(workspaces.groupSync.config).toBeDefined();
  });
});
