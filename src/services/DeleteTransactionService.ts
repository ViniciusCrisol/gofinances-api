import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class CreateTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const foundedTransaction = await transactionRepository.findByIds([id]);

    if (!foundedTransaction[0]) {
      throw new AppError('Transaction no founded.', 401);
    }

    await transactionRepository.remove(foundedTransaction[0]);
  }
}

export default CreateTransactionService;
