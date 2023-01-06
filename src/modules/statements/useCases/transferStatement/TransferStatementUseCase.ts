import { IUsersRepository } from './../../../users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { ITransferStatementDTO } from './ITransferStatementDTO';
import { TransferStatementError } from './TransferStatementError';
import { OperationType } from '../../entities/Statement';

@injectable()
export class TransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, user_recipient_id, amount, description }: ITransferStatementDTO) {

    const user_sender = await this.usersRepository.findById(user_id);

    if (!user_sender) {
      throw new TransferStatementError.UserSenderNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: false
    });

    if (balance < amount) {
      throw new TransferStatementError.UserSenderInsufficientFunds();
    }

    const user_recipient = await this.usersRepository.findById(user_recipient_id);

    if (!user_recipient) {
      throw new TransferStatementError.UserRecipientNotFound();
    }

    //DEBITAR USUÁRIO SENDER
    await this.statementsRepository.create({
      user_id,
      type: OperationType.WITHDRAW,
      amount,
      description
    })

    //CRÉDITAR USUÁRIO RECIPIENT
    await this.statementsRepository.create({
      user_id: user_recipient_id,
      type: OperationType.DEPOSIT,
      amount,
      description
    })

    //RETORNAR AS INFORMAÇÕES DO STATEMENT
    return {
      "id": user_recipient_id,
      "sender_id": user_id,
      "amount": amount,
      "description": description,
      "type": OperationType.TRANSFER,
      "created_at": new Date(),
      "updated_ate": new Date()
    }

  }
}
