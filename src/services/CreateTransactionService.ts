import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

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
    const transactionRepository = getRepository(Transaction);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid transaction type!', 400);
    }

    const transactions = await transactionRepository.find({
      where: { type: 'income' },
    });

    const transactionsIncomeBalance = transactions.reduce(
      (balance, transaction) => {
        return transaction.value + balance;
      },
      0,
    );

    if (value > transactionsIncomeBalance) {
      throw new AppError(
        "You can't create a outcome width a hights value than your incomes.",
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
