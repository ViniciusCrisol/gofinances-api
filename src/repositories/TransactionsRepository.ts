import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {}

export default TransactionsRepository;
