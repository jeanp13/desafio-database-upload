import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactionFind = await transactionRepository.findOne(id);
    if (!transactionFind) {
      throw new AppError('Transaction not find');
    }
    await transactionRepository.delete(transactionFind);
    const transactionExists = await transactionRepository.findOne(id);
    if (transactionExists) throw new AppError('Error in delete');
  }
}

export default DeleteTransactionService;
