import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  category: string;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  public async execute(data: Request): Promise<Transaction> {
    const { title, type, value, category } = data;

    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid transaction type!', 400);
    }

    const balance = await transactionRepository.getBalance();

    if (value > balance.total && type === 'outcome') {
      throw new AppError(
        'You can not create an outcome with a value greater than your income.',
        400,
      );
    }

    const foundedCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!foundedCategory) {
      const createdCategory = await categoryRepository.save({
        title: category,
      });

      const transaction = await transactionRepository.save({
        title,
        type,
        value,
        category_id: createdCategory.id,
      });

      return transaction;
    }

    const transaction = await transactionRepository.save({
      title,
      type,
      value,
      category_id: foundedCategory.id,
    });

    return transaction;
  }
}

export default CreateTransactionService;
