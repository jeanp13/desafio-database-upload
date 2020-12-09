import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction | null> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type is not valid.');
    }
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Saldo insuficiente');
    }
    const categoryFind = await categoryRepository.findOne({
      where: { category },
    });
    if (!categoryFind) {
      const newCategory = categoryRepository.create({
        title: category,
      });
      const categorySaved = await categoryRepository.save(newCategory);
      const trasaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: categorySaved.id,
      });
      return transactionRepository.save(trasaction);
    }

    const trasaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryFind.id,
    });

    return transactionRepository.save(trasaction);
  }
}

export default CreateTransactionService;
