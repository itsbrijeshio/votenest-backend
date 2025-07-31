import { ErrorOptions, ErrorType, ErrorCode } from "../types";

class ApiError extends Error {
  public status: number;
  public type: ErrorType;

  constructor(options: ErrorOptions) {
    super(options.message);
    this.status = options.status;
    this.type = options.type;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;
