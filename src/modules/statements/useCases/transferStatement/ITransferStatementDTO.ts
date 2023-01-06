import { OperationType } from './../../entities/Statement';


export interface ITransferStatementDTO {
  user_id: string;
  user_recipient_id: string;
  amount: number;
  description: string;
}
