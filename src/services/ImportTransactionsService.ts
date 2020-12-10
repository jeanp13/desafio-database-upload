import csv from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';

interface row {
  linha: string[];
}

interface obteto {
  arquivo: row[];
}

class ImportTransactionsService {
  async execute(csvFileName: string): Promise<void> {
    const r: string[];
    const objeto: objeto;
    const userAvatarFilePath = path.join(uploadConfig.directory, csvFileName);
    fs.createReadStream(userAvatarFilePath)
      .pipe(csv())
      .on('data', row => {
        const s: string = row;
        r = s.split(',');
        console.log(r);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }
}

export default ImportTransactionsService;
