/**
 * One estimate per project (`EstimateViewSet.create` 409s on a second); every test deletes its own estimate in `finally`.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 estimates (live)", () => {
  const suite = useV2Project("est", env);

  const proj = () => suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
  const estimates = () => proj().estimates;
  const points = () => proj().estimates.points;

  describe("CRUD", () => {
    it("creates, retrieves, updates, and deletes an estimate", async () => {
      const created = await estimates().create({ name: uniqueName("est-crud"), type: "points" });
      expect(created.id).toBeDefined();
      expect(created.type).toBe("points");

      const fetched = await estimates().retrieve(created.id);
      expect(fetched.name).toBe(created.name);

      const updated = await estimates().update(created.id, { description: "Story point scale" });
      expect(updated.description).toBe("Story point scale");

      await estimates().delete(created.id);
      await expect(estimates().retrieve(created.id)).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 404 });
    });

    it("lists and narrows fields", async () => {
      const created = await estimates().create({ name: uniqueName("est-list"), type: "categories" });
      try {
        const page = await estimates().list({ fields: ["id", "name"] });
        const found = page.data.find((row) => row.id === created.id);
        expect(found).toBeDefined();
        expect(found!.name).toBeDefined();
        // @ts-expect-error `type` was not requested, so it is not on the narrowed type
        expect(found!.type).toBeUndefined();
      } finally {
        await estimates().delete(created.id);
      }
    });

    it("finds by name", async () => {
      const name = uniqueName("est-find");
      const created = await estimates().create({ name });
      try {
        const found = await estimates().findByName(name);
        expect(found.id).toBe(created.id);
      } finally {
        await estimates().delete(created.id);
      }
    });
  });

  describe("upsert", () => {
    it("reconciles on (external_source, external_id)", async () => {
      const externalId = uniqueName("est-ext");
      const write = { name: uniqueName("est-upsert"), external_id: externalId, external_source: "sdk-e2e" };

      const first = await estimates().upsert(write);
      try {
        const renamed = uniqueName("est-upsert-again");
        const second = await estimates().upsert({ ...write, name: renamed });
        expect(second.id).toBe(first.id);
        expect(second.name).toBe(renamed);
      } finally {
        await estimates().delete(first.id);
      }
    });
  });

  describe("expand", () => {
    it("expand=points inlines the point scale instead of just leaving it to a separate call", async () => {
      const created = await estimates().create({ name: uniqueName("est-exp") });
      try {
        await points().create(created.id, { value: "XS", key: 0 });
        const expanded = (await estimates().retrieve(created.id, { expand: ["points"] })) as unknown as Record<
          string,
          unknown
        >;
        expect(expanded.points).toBeDefined();
      } finally {
        await estimates().delete(created.id);
      }
    });
  });

  describe("bulk actions", () => {
    // Estimates are one-per-project, so bulkCreate can only be a "bulk of one";
    // bulkUpdate/bulkDelete still use their real array shape over that one row.
    it("bulkCreate, bulkUpdate, bulkDelete (bulk of one — see the one-per-project note above)", async () => {
      const created = await estimates().bulkCreate([{ name: uniqueName("est-bulk-1") }]);
      expect(created.succeeded).toBe(1);
      const ids = created.results.map((row) => row.id).filter((id): id is string => Boolean(id));

      try {
        const updated = await estimates().bulkUpdate(ids.map((id) => ({ id, description: "bulk-updated" })));
        expect(updated.succeeded).toBe(ids.length);
      } finally {
        // Always attempted, even if bulkUpdate's own assertion throws — otherwise
        // this leaks the project's one estimate and every subsequent test in this
        // file 409s with "An estimate already exists for this project."
        const deleted = await estimates().bulkDelete(ids);
        expect(deleted.succeeded).toBe(ids.length);
      }
    });
  });

  describe("points sub-resource", () => {
    it("creates, retrieves, updates, and deletes a point on an estimate's scale", async () => {
      const estimate = await estimates().create({ name: uniqueName("est-points") });
      try {
        const created = await points().create(estimate.id, { value: "M", key: 1 });
        expect(created.estimate_id).toBe(estimate.id);

        const fetched = await points().retrieve(estimate.id, created.id);
        expect(fetched.value).toBe("M");

        const updated = await points().update(estimate.id, created.id, { value: "L" });
        expect(updated.value).toBe("L");

        await points().delete(estimate.id, created.id);
        await expect(points().retrieve(estimate.id, created.id)).rejects.toMatchObject<Partial<PlaneApiError>>({
          status: 404,
        });
      } finally {
        await estimates().delete(estimate.id);
      }
    });

    it("reconciles on upsert and performs all three bulk actions", async () => {
      const estimate = await estimates().create({ name: uniqueName("est-points-bulk") });
      try {
        const externalId = uniqueName("point-ext");
        const first = await points().upsert(estimate.id, {
          value: "XS",
          external_id: externalId,
          external_source: "sdk-e2e",
        });
        const second = await points().upsert(estimate.id, {
          value: "XXS",
          external_id: externalId,
          external_source: "sdk-e2e",
        });
        expect(second.id).toBe(first.id);

        const created = await points().bulkCreate(estimate.id, [{ value: "S" }, { value: "L" }]);
        expect(created.succeeded).toBe(2);
        const ids = created.results.map((row) => row.id).filter((id): id is string => Boolean(id));

        const updated = await points().bulkUpdate(
          estimate.id,
          ids.map((id) => ({ id, description: "bulk-updated" }))
        );
        expect(updated.succeeded).toBe(ids.length);

        const deleted = await points().bulkDelete(estimate.id, ids);
        expect(deleted.succeeded).toBe(ids.length);
      } finally {
        await estimates().delete(estimate.id);
      }
    });
  });
});
