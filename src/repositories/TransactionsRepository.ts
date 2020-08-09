import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Response {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Response> {
    const transactions = await this.find();

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

export default TransactionsRepository;
