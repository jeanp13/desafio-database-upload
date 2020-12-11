import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository, getRepository } from 'typeorm';
import uploadConfig from '../config/upload';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoryRepository = getRepository(Category);
  const transactions = await transactionsRepository.find();
  await transactions.map(async transaction => {
    // transaction.title = '';
    transaction.category = await categoryRepository.findOneOrFail(
      transaction.category_id,
    );
    // transactions.push(transaction);
    // console.log(category);
    return transaction;
  });
  const balance = await transactionsRepository.getBalance();
  return response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });
  return response.status(200).json({ id: transaction?.id });
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  if (id) {
    await deleteTransactionService.execute(id);
    return response.status(200).json({ ok: true });
  }
  return response.status(400).json({ message: 'Trasaction not find' });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const csvFileName = request.file.filename;
    const imporTransactionService = new ImportTransactionsService();

    const transactions = await imporTransactionService.execute(csvFileName);

    return response.status(200).json({ transactions });
  },
);

export default transactionsRouter;
