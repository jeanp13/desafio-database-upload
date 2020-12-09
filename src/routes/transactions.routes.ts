import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

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
    // console.log(category);
    return transaction;
  });
  const balace = await transactionsRepository.getBalance();
  return response.status(200).json({ transactions, balace });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const trasaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });
  return response.status(200).json({ trasaction });
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
