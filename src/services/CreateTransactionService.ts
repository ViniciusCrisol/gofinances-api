import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  category: string;
  value: number;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid transaction type!', 400);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
