import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionService';

const transactionRouter = Router();

const upload = multer(uploadConfig);

transactionRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category_id'],
    order: {
      created_at: 'DESC',
    },
  });

  const serializedTransactions = transactions.map(transaction => ({
    id: transaction.id,
    title: transaction.title,
    type: transaction.type,
    value: transaction.value,
    created_at: transaction.created_at,
    category: transaction.category_id,
  }));

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions: serializedTransactions, balance });
});

transactionRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.json({ ok: true });
});

transactionRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(request.file.path);

    return response.json(transactions);
  },
);

export default transactionRouter;
