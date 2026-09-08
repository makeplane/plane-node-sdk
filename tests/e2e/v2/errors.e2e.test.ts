/**
 * Error contract against a real server: 404, field-validation 400, cursor-pagination 400; mirrors plane-python-sdk's test_errors.py.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { opsFor, SPECS, WayIn } from "./support/specs";
import { useV2Project } from "./support/suite";

const MISSING_ID = "00000000-0000-0000-0000-000000000000";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

/**
 * Driven flat: these assert the server's error contract, which the way in does not change.
 * `crud.e2e.test.ts` covers both shapes.
 */
const WAY: WayIn = "flat";

maybe("v2 error contract (live)", () => {
  const suite = useV2Project("errors", env);

  describe.each(SPECS)("$key", (spec) => {
    it("retrieve of a missing id surfaces a 404 PlaneApiError", async () => {
      const ops = opsFor(spec, WAY, suite);
      let caught: PlaneApiError | undefined;
      try {
        await ops.retrieve(MISSING_ID);
      } catch (error) {
        caught = error as PlaneApiError;
      }
      expect(caught).toBeInstanceOf(PlaneApiError);
      expect(caught!.status).toBe(404);
      expect(caught!.code).toBe("not_found");
      expect(caught!.detail).toBeTruthy();
    });

    it("an over-length name surfaces field-level .errors", async () => {
      const ops = opsFor(spec, WAY, suite);
      const tooLong = uniqueName(spec.key) + "x".repeat(300);
      let caught: PlaneApiError | undefined;
      try {
        await ops.create(spec.makeWrite(tooLong));
      } catch (error) {
        caught = error as PlaneApiError;
      }
      expect(caught).toBeInstanceOf(PlaneApiError);
      expect(caught!.status).toBe(400);
      expect(caught!.errors).toBeDefined();
      expect(caught!.errors!.some((fieldError) => fieldError.field === "name")).toBe(true);
    });

    // Deliberate server behavior: `paginate: "cursor"` with no `order_by` 400s
    // because the default ordering isn't cursor-safe.
    it("cursor pagination without an explicit order_by 400s (known API behavior)", async () => {
      const ops = opsFor(spec, WAY, suite);
      let caught: PlaneApiError | undefined;
      try {
        await ops.list({ paginate: "cursor" });
      } catch (error) {
        caught = error as PlaneApiError;
      }
      expect(caught).toBeInstanceOf(PlaneApiError);
      expect(caught!.status).toBe(400);
      expect(caught!.code).toBe("ordering_not_cursor_eligible");
    });
  });
});
