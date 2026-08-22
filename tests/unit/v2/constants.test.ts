import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BULK_MAX_ITEMS,
  EXPAND,
  FIELDS,
  LABEL_FIELDS,
  OPENAPI_VERSION,
  ORDER_BY,
  STATE_FIELDS,
  WORK_ITEM_EXPAND,
  WORK_ITEM_FIELDS,
  WORK_ITEM_ORDER_BY,
} from "../../../src/api/v2/generated/constants";

// Reads the committed file's own source text (TS strips comments on import) and
// avoids the plane-ee golden so these unit tests run standalone.
const generatedSource = readFileSync(join(__dirname, "../../../src/api/v2/generated/constants.ts"), "utf8");

describe("generated constants", () => {
  it("carries the state field enum from the API", () => {
    expect(STATE_FIELDS).toContain("name");
    expect(STATE_FIELDS).toContain("group");
    expect(STATE_FIELDS).toContain("all");
  });

  it("carries the label field enum", () => {
    expect(LABEL_FIELDS).toContain("parent_id");
  });

  it("indexes fields by operation id", () => {
    expect(FIELDS["states_list"]).toEqual([...STATE_FIELDS]);
  });

  it("bounds order_by", () => {
    expect(ORDER_BY["states_list"]).toContain("-created_at");
    expect(ORDER_BY["states_list"]).not.toContain("name");
  });

  it("carries the work item field/order_by convenience exports", () => {
    expect(WORK_ITEM_FIELDS).toContain("identifier");
    expect(WORK_ITEM_ORDER_BY).toContain("-priority");
  });

  it("carries the expand enum, keyed by operation id like FIELDS/ORDER_BY", () => {
    expect(EXPAND["work_items_list"]).toEqual(
      [...WORK_ITEM_EXPAND].sort() // record() sorts values, so compare sorted-to-sorted
    );
    expect(WORK_ITEM_EXPAND).toEqual(
      expect.arrayContaining(["assignees", "cycle", "labels", "modules", "parent", "state", "type"])
    );
  });

  it("does not carry expand for an operation the golden gives none to", () => {
    expect(EXPAND["states_list" as keyof typeof EXPAND]).toBeUndefined();
  });

  it("caps batches at 50", () => {
    expect(BULK_MAX_ITEMS).toBe(50);
  });

  it("exposes the golden's API version as a well-formed semver string", () => {
    // Not hardcoded to "2.0.0" so a version+golden drift wouldn't still pass;
    // this checks shape only.
    expect(OPENAPI_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("records provenance in the generated file's header", () => {
    expect(generatedSource).toMatch(/^\/\/ Source golden: .+$/m);
    expect(generatedSource).toMatch(/^\/\/ api_v2 OpenAPI version: \d+\.\d+\.\d+$/m);
  });
});
