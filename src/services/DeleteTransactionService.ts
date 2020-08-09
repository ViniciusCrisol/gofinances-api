import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const foundedTransaction = await transactionRepository.findByIds([id]);

    if (!foundedTransaction[0]) {
      throw new AppError('Transaction not founded.', 401);
    }

    await transactionRepository.remove(foundedTransaction[0]);
  }
}

export default DeleteTransactionService;
