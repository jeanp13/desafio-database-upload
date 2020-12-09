import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balance = transactions.reduce(
      (acumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            acumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            acumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        acumulator.total = acumulator.income - acumulator.outcome;
        return acumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }

  // public async create({
  //   title,
  //   type,
  //   value,
  //   category,
  // }: TransactionDTO): Promise<Transaction> {
  //   const transaction = new Transaction({ title, type, value, category });
  //   if (type === 'outcome') {
  //     const { total } = this.getBalance();
  //     if (total < value) throw Error('Saldo Insuficiente');
  //   }
  //   const transactions = await this.find();
  //   transactions.push(transaction);
  //   return transaction;
  // }
}

export default TransactionsRepository;
