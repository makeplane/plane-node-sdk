/**
 * list/retrieve/create/update/delete driven over states+labels via `SPECS` (support/specs.ts), one shared project.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { LabelField } from "../../../src/api/v2/generated/constants";
import { State } from "../../../src/models/v2/State";
import { Label } from "../../../src/models/v2/Label";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { SPECS } from "./support/specs";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 CRUD (live)", () => {
  const suite = useV2Project("crud", env);

  describe.each(SPECS)("$key", (spec) => {
    describe("list", () => {
      let row: State | Label;

      beforeAll(async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        row = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-list`)));
      });

      afterAll(async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        await ops.delete(row.id).catch(() => undefined);
      });

      it("lists by project uuid", async () => {
        const page = await spec.chained(suite.client, suite.workspaceSlug, suite.projectId).list();
        expect(Array.isArray(page.data)).toBe(true);
      });

      it("lists by project key", async () => {
        const page = await spec.chained(suite.client, suite.workspaceSlug, suite.projectKey).list();
        expect(Array.isArray(page.data)).toBe(true);
      });

      it("project uuid and project key agree", async () => {
        const byId = await spec.chained(suite.client, suite.workspaceSlug, suite.projectId).list();
        const byKey = await spec.chained(suite.client, suite.workspaceSlug, suite.projectKey).list();
        expect(new Set(byId.data.map((r) => r.id))).toEqual(new Set(byKey.data.map((r) => r.id)));
      });

      it("without fields returns the full row", async () => {
        const page = await spec.chained(suite.client, suite.workspaceSlug, suite.projectId).list();
        const found = page.data.find((r) => r.id === row.id);
        expect(found).toBeDefined();
        expect(found!.name).toBe(row.name);
        expect(found!.color).toBeDefined();
      });

      it("with fields is sparse: an unrequested field is undefined, not an error", async () => {
        const page = await spec
          .chained(suite.client, suite.workspaceSlug, suite.projectId)
          .list({ fields: ["id", "name"] });
        const found = page.data.find((r) => r.id === row.id);
        expect(found).toBeDefined();
        expect(found!.name).toBeDefined();
        expect(found!.color).toBeUndefined();
        expect(found!.created_at).toBeUndefined();
        expect(found!.external_id).toBeUndefined();
      });
    });

    describe("retrieve", () => {
      let row: State | Label;

      beforeAll(async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        row = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-retrieve`)));
      });

      afterAll(async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        await ops.delete(row.id).catch(() => undefined);
      });

      it("returns the created row", async () => {
        const fetched = await spec.chained(suite.client, suite.workspaceSlug, suite.projectId).retrieve(row.id);
        expect(fetched.id).toBe(row.id);
        expect(fetched.name).toBe(row.name);
        expect(fetched.color).toBeDefined();
      });

      it("with fields is sparse", async () => {
        const fetched = await spec
          .chained(suite.client, suite.workspaceSlug, suite.projectId)
          .retrieve(row.id, { fields: ["id", "name"] });
        expect(fetched.id).toBe(row.id);
        expect(fetched.color).toBeUndefined();
      });
    });

    describe("create", () => {
      it("returns the written fields", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const name = uniqueName(`${spec.key}-create`);
        const created = await ops.create(spec.makeWrite(name, { color: "#abcdef" }));
        try {
          expect(created.name).toBe(name);
          expect(created.color).toBe("#abcdef");
          expect(created.id).toBeTruthy();
        } finally {
          await ops.delete(created.id);
        }
      });
    });

    describe("update", () => {
      it("PATCH updates only the given fields", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const row = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-update`)));
        try {
          const newName = uniqueName(`${spec.key}-renamed`);
          const updated = await ops.update(row.id, spec.makePatch({ name: newName }));
          expect(updated.id).toBe(row.id);
          expect(updated.name).toBe(newName);
          expect(updated.color).toBe(row.color); // untouched field survives the PATCH
        } finally {
          await ops.delete(row.id);
        }
      });
    });

    describe("delete", () => {
      it("delete then retrieve 404s", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const row = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-delete`)));
        await ops.delete(row.id);
        await expect(ops.retrieve(row.id)).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 404 });
      });
    });
  });
});

/**
 * Checked directly against per-resource literal-tuple overloads (not the generic `SPECS` erasure) so the compiler is exercised.
 */
maybe("v2 typed field projection (live)", () => {
  const suite = useV2Project("fields", env);
  let client: PlaneClient;

  beforeAll(() => {
    client = suite.client;
  });

  it("narrows .states.list to the requested fields (inline literal)", async () => {
    const eng = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const created = await eng.states.create({
      name: uniqueName("states-typed"),
      color: "#112233",
    });
    try {
      const page = await eng.states.list({
        fields: ["id", "name"] as const,
      });
      const found = page.data.find((row) => row.id === created.id);
      expect(found).toBeDefined();
      const narrowedName: string | undefined = found!.name; // compiles only if narrowed correctly
      expect(narrowedName).toBeDefined();
      // @ts-expect-error `color` was not requested, so it is not on the narrowed type
      expect(found!.color).toBeUndefined();
    } finally {
      await eng.states.delete(created.id);
    }
  });

  it("narrows .labels.list with a dynamically-typed LabelField[]", async () => {
    const eng = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const dynamicFields: LabelField[] = ["id", "color"];
    const created = await eng.labels.create({
      name: uniqueName("labels-typed"),
      color: "#445566",
    });
    try {
      const page = await eng.labels.list({ fields: dynamicFields });
      const found = page.data.find((row) => row.id === created.id);
      expect(found).toBeDefined();
      expect(found!.color).toBeDefined();
      expect(found!.name).toBeUndefined();
    } finally {
      await eng.labels.delete(created.id);
    }
  });
});
