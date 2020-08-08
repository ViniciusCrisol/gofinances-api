import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTransactionsValue = this.transactions.reduce(
      (total, transaction) => {
        if (transaction.type === 'income') return transaction.value + total;

        return total;
      },
      0,
    );

    const outcomeTransactionsValue = this.transactions.reduce(
      (total, transaction) => {
        if (transaction.type === 'outcome') return transaction.value + total;

        return total;
      },
      0,
    );

    return {
      income: incomeTransactionsValue,
      outcome: outcomeTransactionsValue,
      total: incomeTransactionsValue - outcomeTransactionsValue,
    };
  }

  public create({ title, type, value }: Omit<Transaction, 'id'>): Transaction {
    const newTransaction = new Transaction({ title, type, value });

    const incomeTransactionsValue = this.transactions.reduce(
      (total, transaction) => {
        if (transaction.type === 'income') return transaction.value + total;

        return total;
      },
      0,
    );

    if (
      newTransaction.type === 'outcome' &&
      newTransaction.value > incomeTransactionsValue
    ) {
      throw new Error('Transaction value must be lower than your balance!');
    }

    this.transactions.push(newTransaction);

    return newTransaction;
  }
}

export default TransactionsRepository;
