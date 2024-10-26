import { ArgumentInvalidError, ExternalApiError } from 'src/kernel/errors';

export class MailgunSendEmailParamsError extends ArgumentInvalidError {
  constructor(message: string, details?: any, error?: Error) {
    super(message, details, error);
  }
}

export class MailgunSendEmailError extends ExternalApiError {
  constructor(message: string, details?: any, error?: Error) {
    super(message, details, error);
  }
}
