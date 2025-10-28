/**
 * Base error class for all Plane SDK errors
 */
export class PlaneError extends Error {
  public statusCode?: number;
  public response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = "PlaneError";
    this.statusCode = statusCode;
    this.response = response;
  }
}
