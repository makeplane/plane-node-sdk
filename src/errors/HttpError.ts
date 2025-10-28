import { PlaneError } from "./PlaneError";

/**
 * HTTP-specific error class for API request failures
 */
export class HttpError extends PlaneError {
  constructor(message: string, statusCode: number, response?: any) {
    super(message, statusCode, response);
    this.name = "HttpError";
  }
}
