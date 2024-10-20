class InternalError extends Error {
  details?: any;
  error?: Error;

  constructor(message: string, details?: any, error?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends InternalError {
  constructor(message: string, details?: any, error?: Error) {
    super(message, details, error);
  }
}

export class ConflictError extends InternalError {
  constructor(message: string, details?: any, error?: Error) {
    super(message, details, error);
  }
}

export class ExternalApiError extends InternalError {
  constructor(message: string, details?: any, error?: Error) {
    super(message, details, error);
  }
}

export class ArgumentInvalidError extends InternalError {
  constructor(message: string, details?: any, error?: Error) {
    super(message, details, error);
  }
}
