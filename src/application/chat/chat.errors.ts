import { ArgumentInvalidError } from 'src/kernel/errors';

export class DailyChatLimitExceededError extends ArgumentInvalidError {
  constructor(message: string, details?: any, error?: Error) {
    super(message, details, error);
  }
}
