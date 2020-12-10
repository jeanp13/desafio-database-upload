import csv from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  private r: Transaction[];

  async execute(csvFileName: string): Promise<Transaction[]> {
    this.r = [];
    const userAvatarFilePath = path.join(uploadConfig.directory, csvFileName);
    const parser = await csv({ columns: true }, function (err, records) {
      console.log(records);
      const { title, type, value, category_id }: Transaction = records;
      const transactionService = new CreateTransactionService();
      const transaction = transactionService.execute({
        title,
        type,
        value,
        category: category_id,
      });
      //r.push(transaction);
    });

    const ret = await fs.createReadStream(userAvatarFilePath).pipe(parser);
    console.log(ret);
    return this.r;
  }
}

export default ImportTransactionsService;
