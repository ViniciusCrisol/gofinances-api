import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import ShowTransactionsBalance from '../services/ShowTransactionsBalance';

const transactionRouter = Router();

transactionRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();
    const showBalance = new ShowTransactionsBalance();

    const balance = await showBalance.execute();

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', async (request, response) => {
  try {
    const { title, type, value, category } = request.body;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      title,
      type,
      value,
      category,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
