import { PlaneApiError } from "../../../src/errors/PlaneApiError";

describe("PlaneApiError message", () => {
  it("ends with the field messages, which say why the request was refused", () => {
    const error = PlaneApiError.fromPayload(400, {
      code: "invalid_request",
      detail: "One or more fields failed validation.",
      errors: [
        { field: "role", message: "Workspace guests can only be assigned commenter or guest roles on projects" },
        { field: "member_id", message: "Not a member of this workspace." },
      ],
    });

    expect(error.message).toBe(
      "HTTP 400 invalid_request: One or more fields failed validation. " +
        "(role: Workspace guests can only be assigned commenter or guest roles on projects; " +
        "member_id: Not a member of this workspace.)"
    );
    expect(error.errors).toHaveLength(2);
  });

  it("keeps the plain message when there are no field errors", () => {
    const error = PlaneApiError.fromPayload(404, { code: "not_found", detail: "Not found." });

    expect(error.message).toBe("HTTP 404 not_found: Not found.");
  });
});
