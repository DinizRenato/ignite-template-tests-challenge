import { AppError } from './../../../../shared/errors/AppError';
export namespace TransferStatementError {

  export class UserSenderNotFound extends AppError {
    constructor() {
      super('Sender user not found', 404);
    }
  }

  export class UserSenderInsufficientFunds extends AppError {
    constructor() {
      super('User sender Insufficient funds', 400);
    }
  }

  export class UserRecipientNotFound extends AppError {
    constructor() {
      super('Recipient user not found', 404);
    }
  }

}
