/**
 * `makeProjectIdentifier` is pure, so it's tested here even though it lives under `tests/e2e/v2/support/`.
 */
import { makeProjectIdentifier } from "../../e2e/v2/support/project";

describe("makeProjectIdentifier", () => {
  it("never exceeds the server's 10-char cap, for a range of label lengths", () => {
    for (const label of ["", "a", "wi", "wic", "wirl", "bulk", "crud", "page", "workitems", "a-very-long-label"]) {
      const identifier = makeProjectIdentifier(label);
      expect(identifier.length).toBeLessThanOrEqual(10);
      expect(identifier.length).toBeGreaterThan(0);
    }
  });

  it("starts with the N prefix and is upper-case", () => {
    const identifier = makeProjectIdentifier("crud");
    expect(identifier[0]).toBe("N");
    expect(identifier).toBe(identifier.toUpperCase());
  });

  // Regression: the old slice kept the timestamp's leading digits and discarded
  // the fast-changing tail, so back-to-back calls collided.
  it("produces zero duplicates across many identifiers generated in a tight loop, per label", () => {
    const ATTEMPTS = 500;
    for (const label of ["bulk", "crud", "page", "wi", "workitems"]) {
      const seen = new Set<string>();
      for (let i = 0; i < ATTEMPTS; i++) seen.add(makeProjectIdentifier(label));
      expect(seen.size).toBe(ATTEMPTS);
    }
  });

  it("produces zero duplicates across many identifiers generated in a tight loop, across different labels", () => {
    const ATTEMPTS = 500;
    const labels = ["bulk", "crud", "page", "wi", "wic", "wis", "wirl", "upsert", "findone", "fields", "workitems"];
    const seen = new Set<string>();
    for (let i = 0; i < ATTEMPTS; i++) seen.add(makeProjectIdentifier(labels[i % labels.length]));
    expect(seen.size).toBe(ATTEMPTS);
  });
});
