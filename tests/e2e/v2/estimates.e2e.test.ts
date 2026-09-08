/**
 * One estimate per project (`EstimateViewSet.create` 409s on a second); every test deletes its own estimate in `finally`.
 *
 * The estimate collection is driven flat — the "lists and narrows fields" case needs the
 * `fields` narrowing, which `Owned` erases — and the point scale off each fetched
 * estimate row, whose navigation property is **`estimatePoints`**, not `points`: the row
 * already carries an API field called `points`, and `loadRow` refuses to define a
 * navigation property over it.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 estimates (live)", () => {
  const suite = useV2Project("est", env);

  const estimates = () => suite.client.v2.projects.estimates;
  const slug = () => suite.workspaceSlug;
  const project = () => suite.projectId;

  describe("CRUD", () => {
    it("creates, retrieves, updates, and deletes an estimate", async () => {
      const created = await estimates().create(slug(), project(), { name: uniqueName("est-crud"), type: "points" });
      expect(created.id).toBeDefined();
      expect(created.type).toBe("points");

      const fetched = await estimates().retrieve(slug(), project(), created.id);
      expect(fetched.name).toBe(created.name);

      const updated = await estimates().update(slug(), project(), created.id, { description: "Story point scale" });
      expect(updated.description).toBe("Story point scale");

      await estimates().delete(slug(), project(), created.id);
      await expect(estimates().retrieve(slug(), project(), created.id)).rejects.toMatchObject<Partial<PlaneApiError>>({
        status: 404,
      });
    });

    it("lists and narrows fields", async () => {
      const created = await estimates().create(slug(), project(), { name: uniqueName("est-list"), type: "categories" });
      try {
        const page = await estimates().list(slug(), project(), { fields: ["id", "name"] });
        const found = page.data.find((row) => row.id === created.id);
        expect(found).toBeDefined();
        expect(found!.name).toBeDefined();
        // @ts-expect-error `type` was not requested, so it is not on the narrowed type
        expect(found!.type).toBeUndefined();
      } finally {
        await estimates().delete(slug(), project(), created.id);
      }
    });

    it("finds by name", async () => {
      const name = uniqueName("est-find");
      const created = await estimates().create(slug(), project(), { name });
      try {
        const found = await estimates().findByName(slug(), project(), name);
        expect(found.id).toBe(created.id);
      } finally {
        await estimates().delete(slug(), project(), created.id);
      }
    });
  });

  describe("upsert", () => {
    it("reconciles on (external_source, external_id)", async () => {
      const externalId = uniqueName("est-ext");
      const write = { name: uniqueName("est-upsert"), external_id: externalId, external_source: "sdk-e2e" };

      const first = await estimates().upsert(slug(), project(), write);
      try {
        const renamed = uniqueName("est-upsert-again");
        const second = await estimates().upsert(slug(), project(), { ...write, name: renamed });
        expect(second.id).toBe(first.id);
        expect(second.name).toBe(renamed);
      } finally {
        await estimates().delete(slug(), project(), first.id);
      }
    });
  });

  describe("expand", () => {
    it("expand=points inlines the point scale instead of just leaving it to a separate call", async () => {
      const created = await estimates().create(slug(), project(), { name: uniqueName("est-exp") });
      try {
        await created.estimatePoints.create({ value: "XS", key: 0 });
        const expanded = (await estimates().retrieve(slug(), project(), created.id, {
          expand: ["points"],
        })) as unknown as Record<string, unknown>;
        expect(expanded.points).toBeDefined();
      } finally {
        await estimates().delete(slug(), project(), created.id);
      }
    });
  });

  describe("bulk actions", () => {
    // Estimates are one-per-project, so bulkCreate can only be a "bulk of one";
    // bulkUpdate/bulkDelete still use their real array shape over that one row.
    it("bulkCreate, bulkUpdate, bulkDelete (bulk of one — see the one-per-project note above)", async () => {
      const created = await estimates().bulkCreate(slug(), project(), [{ name: uniqueName("est-bulk-1") }]);
      expect(created.succeeded).toBe(1);
      const ids = created.results.map((row) => row.id).filter((id): id is string => Boolean(id));

      try {
        const updated = await estimates().bulkUpdate(
          slug(),
          project(),
          ids.map((id) => ({ id, description: "bulk-updated" }))
        );
        expect(updated.succeeded).toBe(ids.length);
      } finally {
        // Always attempted, even if bulkUpdate's own assertion throws — otherwise
        // this leaks the project's one estimate and every subsequent test in this
        // file 409s with "An estimate already exists for this project."
        const deleted = await estimates().bulkDelete(slug(), project(), ids);
        expect(deleted.succeeded).toBe(ids.length);
      }
    });
  });

  describe("points sub-resource", () => {
    it("creates, retrieves, updates, and deletes a point on an estimate's scale", async () => {
      const estimate = await estimates().create(slug(), project(), { name: uniqueName("est-points") });
      try {
        const created = await estimate.estimatePoints.create({ value: "M", key: 1 });
        expect(created.estimate_id).toBe(estimate.id);

        const fetched = await estimate.estimatePoints.retrieve(created.id);
        expect(fetched.value).toBe("M");

        const byKey = await estimate.estimatePoints.findByKey(1);
        expect(byKey.id).toBe(created.id);

        const updated = await estimate.estimatePoints.update(created.id, { value: "L" });
        expect(updated.value).toBe("L");

        await estimate.estimatePoints.delete(created.id);
        await expect(estimate.estimatePoints.retrieve(created.id)).rejects.toMatchObject<Partial<PlaneApiError>>({
          status: 404,
        });
      } finally {
        await estimates().delete(slug(), project(), estimate.id);
      }
    });

    it("reconciles on upsert and performs all three bulk actions", async () => {
      const estimate = await estimates().create(slug(), project(), { name: uniqueName("est-points-bulk") });
      try {
        const externalId = uniqueName("point-ext");
        const first = await estimate.estimatePoints.upsert({
          value: "XS",
          external_id: externalId,
          external_source: "sdk-e2e",
        });
        const second = await estimate.estimatePoints.upsert({
          value: "XXS",
          external_id: externalId,
          external_source: "sdk-e2e",
        });
        expect(second.id).toBe(first.id);

        const created = await estimate.estimatePoints.bulkCreate([{ value: "S" }, { value: "L" }]);
        expect(created.succeeded).toBe(2);
        const ids = created.results.map((row) => row.id).filter((id): id is string => Boolean(id));

        const updated = await estimate.estimatePoints.bulkUpdate(
          ids.map((id) => ({ id, description: "bulk-updated" }))
        );
        expect(updated.succeeded).toBe(ids.length);

        const deleted = await estimate.estimatePoints.bulkDelete(ids);
        expect(deleted.succeeded).toBe(ids.length);
      } finally {
        await estimates().delete(slug(), project(), estimate.id);
      }
    });
  });
});
