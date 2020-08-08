import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

type Request = Omit<Transaction, 'id'>;

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: Request): Request {
    if (type !== 'income' && type !== 'outcome') {
      throw Error('Invalid transaction type!');
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
