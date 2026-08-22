import { PlaneError } from "./PlaneError";

/** Thrown when a v2 request never reaches a server (connection refused, DNS failure, timeout) — else it collapsed into a fabricated 500. */
export class PlaneNetworkError extends PlaneError {
  /** The underlying axios/network error, for callers that want to inspect it. */
  public cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "PlaneNetworkError";
    this.cause = cause;
  }
}
