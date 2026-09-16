import { PlaneError } from "./PlaneError";

/** One entry of a ValidationProblemDetail `errors` array. */
export interface FieldError {
  field: string;
  message: string;
}

/** The body shape of an api_v2 error response (RFC 9457). */
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  code: string;
  detail: string;
  errors?: FieldError[];
}

/** A non-2xx api_v2 response. `code` is an open vocabulary — compare it as a plain string, not a union. */
export class PlaneApiError extends PlaneError {
  public status: number;
  public type: string;
  public code: string;
  public detail: string;
  public title?: string;
  public errors?: FieldError[];

  constructor(problem: ProblemDetail) {
    super(`HTTP ${problem.status} ${problem.code}: ${problem.detail}`, problem.status, problem);
    this.name = "PlaneApiError";
    this.status = problem.status;
    this.type = problem.type;
    this.code = problem.code;
    this.detail = problem.detail;
    this.title = problem.title;
    this.errors = problem.errors;
  }

  /** Build from a parsed body; tolerates a non-problem body from a proxy or gateway. */
  static fromPayload(status: number, payload: unknown): PlaneApiError {
    if (payload && typeof payload === "object" && "code" in payload) {
      const problem = payload as Partial<ProblemDetail>;
      return new PlaneApiError({
        type: problem.type ?? "server_error",
        title: problem.title ?? "Request failed",
        status: problem.status ?? status,
        code: problem.code ?? "server_error",
        detail: problem.detail ?? "Request failed.",
        errors: problem.errors,
      });
    }
    return new PlaneApiError({
      type: "server_error",
      title: "Request failed",
      status,
      code: "server_error",
      detail: typeof payload === "string" && payload ? payload : "Request failed.",
    });
  }
}

/** An identity lookup (`findByName`) matched nothing. */
export class NoMatchFoundError extends PlaneError {
  constructor(message: string) {
    super(message);
    this.name = "NoMatchFoundError";
  }
}

/** An identity lookup matched more than one row. */
export class MultipleMatchesFoundError extends PlaneError {
  constructor(message: string) {
    super(message);
    this.name = "MultipleMatchesFoundError";
  }
}
