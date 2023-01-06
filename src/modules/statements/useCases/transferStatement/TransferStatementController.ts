import { TransferStatementUseCase } from './TransferStatementUseCase';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export class TransferStatementController {

  async execute(request: Request, response: Response) {

    const { id: user_id } = request.user;
    const { user_recipient_id } = request.params;
    const { amount, description } = request.body;

    const transferStatement = container.resolve(TransferStatementUseCase);

    const transfer = await transferStatement.execute({
      user_id,
      user_recipient_id,
      amount,
      description
    })

    return response.status(201).json(transfer)

  }
}
