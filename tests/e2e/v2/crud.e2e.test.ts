/**
 * list/retrieve/create/update/delete driven over states+labels via `SPECS` (support/specs.ts), one shared project.
 *
 * Every case runs twice: once flat (`v2.projects.states.list(slug, project)`) and once
 * navigated (`projectRow.states.list()`). The two reach the same HTTP but not through the
 * same code — only the navigated path goes through `owned()`, which prepends the row's
 * path ids positionally. That prepending cannot be wrong in a way the unit sweeps see: a
 * mis-ordered pair of ids is two strings in two string parameters, and the URL it builds
 * is well-formed and points somewhere else. This file is where that is checked.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { LabelField } from "../../../src/api/v2/generated/constants";
import { State } from "../../../src/models/v2/State";
import { Label } from "../../../src/models/v2/Label";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { opsFor, SPECS, WAYS_IN } from "./support/specs";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 CRUD (live)", () => {
  const suite = useV2Project("crud", env);

  describe.each(WAYS_IN)("via %s", (way) => {
    describe.each(SPECS)("$key", (spec) => {
      const ops = () => opsFor(spec, way, suite);

      describe("list", () => {
        let row: State | Label;

        beforeAll(async () => {
          row = await ops().create(spec.makeWrite(uniqueName(`${spec.key}-list-${way}`)));
        });

        afterAll(async () => {
          await ops()
            .delete(row.id)
            .catch(() => undefined);
        });

        it("lists", async () => {
          const page = await ops().list();
          expect(Array.isArray(page.data)).toBe(true);
        });

        it("without fields returns the full row", async () => {
          const page = await ops().list();
          const found = page.data.find((r) => r.id === row.id);
          expect(found).toBeDefined();
          expect(found!.name).toBe(row.name);
          expect(found!.color).toBeDefined();
        });

        it("with fields is sparse: an unrequested field is undefined, not an error", async () => {
          const page = await ops().list({ fields: ["id", "name"] });
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
          row = await ops().create(spec.makeWrite(uniqueName(`${spec.key}-retrieve-${way}`)));
        });

        afterAll(async () => {
          await ops()
            .delete(row.id)
            .catch(() => undefined);
        });

        it("returns the created row", async () => {
          const fetched = await ops().retrieve(row.id);
          expect(fetched.id).toBe(row.id);
          expect(fetched.name).toBe(row.name);
          expect(fetched.color).toBeDefined();
        });

        it("with fields is sparse", async () => {
          const fetched = await ops().retrieve(row.id, { fields: ["id", "name"] });
          expect(fetched.id).toBe(row.id);
          expect(fetched.color).toBeUndefined();
        });
      });

      describe("create", () => {
        it("returns the written fields", async () => {
          const name = uniqueName(`${spec.key}-create-${way}`);
          const created = await ops().create(spec.makeWrite(name, { color: "#abcdef" }));
          try {
            expect(created.name).toBe(name);
            expect(created.color).toBe("#abcdef");
            expect(created.id).toBeTruthy();
          } finally {
            await ops().delete(created.id);
          }
        });
      });

      describe("update", () => {
        it("PATCH updates only the given fields", async () => {
          const row = await ops().create(spec.makeWrite(uniqueName(`${spec.key}-update-${way}`)));
          try {
            const newName = uniqueName(`${spec.key}-renamed`);
            const updated = await ops().update(row.id, spec.makePatch({ name: newName }));
            expect(updated.id).toBe(row.id);
            expect(updated.name).toBe(newName);
            expect(updated.color).toBe(row.color); // untouched field survives the PATCH
          } finally {
            await ops().delete(row.id);
          }
        });
      });

      describe("delete", () => {
        it("delete then retrieve 404s", async () => {
          const row = await ops().create(spec.makeWrite(uniqueName(`${spec.key}-delete-${way}`)));
          await ops().delete(row.id);
          await expect(ops().retrieve(row.id)).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 404 });
        });
      });
    });
  });

  /**
   * The flat form takes a project's UUID *or* its bare identifier in the same parameter,
   * and both must address the same project. Only expressible flat: a navigated call has
   * already been bound to whichever key `rowId` chose.
   */
  describe.each(SPECS)("$key: project uuid and project key are interchangeable", (spec) => {
    it("both address the same project", async () => {
      const byId = await spec.flat(suite.client, suite.workspaceSlug, suite.projectId).list();
      const byKey = await spec.flat(suite.client, suite.workspaceSlug, suite.projectKey).list();
      expect(new Set(byId.data.map((r) => r.id))).toEqual(new Set(byKey.data.map((r) => r.id)));
    });
  });
});

/**
 * Checked directly against per-resource literal-tuple overloads (not the generic `SPECS` erasure) so the compiler is exercised.
 *
 * **Flat on purpose, and it has to be.** `Owned` erases the type parameter through its
 * conditional, so a navigated `list({ fields })` answers the full row — documented on
 * `Owned`, in the README, and pinned in `tests/unit/v2/navigation-types.test.ts`. The
 * narrowing this file asserts is reachable only through the flat form, which is the
 * concrete reason the flat form stays public rather than becoming an implementation
 * detail of navigation.
 */
maybe("v2 typed field projection (live)", () => {
  const suite = useV2Project("fields", env);
  let client: PlaneClient;

  beforeAll(() => {
    client = suite.client;
  });

  it("narrows .states.list to the requested fields (inline literal)", async () => {
    const states = client.v2.projects.states;
    const created = await states.create(suite.workspaceSlug, suite.projectId, {
      name: uniqueName("states-typed"),
      color: "#112233",
    });
    try {
      const page = await states.list(suite.workspaceSlug, suite.projectId, {
        fields: ["id", "name"] as const,
      });
      const found = page.data.find((row) => row.id === created.id);
      expect(found).toBeDefined();
      const narrowedName: string | undefined = found!.name; // compiles only if narrowed correctly
      expect(narrowedName).toBeDefined();
      // @ts-expect-error `color` was not requested, so it is not on the narrowed type
      expect(found!.color).toBeUndefined();
    } finally {
      await states.delete(suite.workspaceSlug, suite.projectId, created.id);
    }
  });

  it("narrows .labels.list with a dynamically-typed LabelField[]", async () => {
    const labels = client.v2.projects.labels;
    const dynamicFields: LabelField[] = ["id", "color"];
    const created = await labels.create(suite.workspaceSlug, suite.projectId, {
      name: uniqueName("labels-typed"),
      color: "#445566",
    });
    try {
      const page = await labels.list(suite.workspaceSlug, suite.projectId, { fields: dynamicFields });
      const found = page.data.find((row) => row.id === created.id);
      expect(found).toBeDefined();
      expect(found!.color).toBeDefined();
      expect(found!.name).toBeUndefined();
    } finally {
      await labels.delete(suite.workspaceSlug, suite.projectId, created.id);
    }
  });

  /**
   * The documented cost of navigating: the same `fields` call off a fetched row answers
   * the *full* row type. Asserted here as a live behavioral fact — the projection still
   * happens on the wire (`color` really is absent), it is only the static type that
   * widens — so the trade-off the README describes is pinned by a real response, not
   * only by a type-level test.
   */
  it("navigated .states.list still projects on the wire, though the type widens", async () => {
    const created = await suite.projectRow.states.create({
      name: uniqueName("states-navigated"),
      color: "#778899",
    });
    try {
      const page = await suite.projectRow.states.list({ fields: ["id", "name"] });
      const found = page.data.find((row) => row.id === created.id);
      expect(found).toBeDefined();
      // The static type here is the full `State` — `Owned` erased `F` — but the server
      // still honored `?fields=`, so the unrequested field is absent at runtime.
      expect(found!.name).toBeDefined();
      expect(found!.color).toBeUndefined();
    } finally {
      await suite.projectRow.states.delete(created.id);
    }
  });
});
