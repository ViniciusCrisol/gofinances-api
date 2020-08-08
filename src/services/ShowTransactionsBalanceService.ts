import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Response {
  income: number;
  outcome: number;
  total: number;
}

class AuthenticateUserService {
  public async execute(): Promise<Response> {
    const transactionRepository = getRepository(Transaction);

    const transactions = await transactionRepository.find();

    const incomeValue = transactions.reduce((balance, transaction) => {
      if (transaction.type === 'income') {
        return transaction.value + balance;
      }

      return balance;
    }, 0);

    const outcomeValue = transactions.reduce((balance, transaction) => {
      if (transaction.type === 'outcome') {
        return transaction.value + balance;
      }

      return balance;
    }, 0);

    return {
      income: incomeValue,
      outcome: outcomeValue,
      total: incomeValue - outcomeValue,
    };
  }
}

export default AuthenticateUserService;
