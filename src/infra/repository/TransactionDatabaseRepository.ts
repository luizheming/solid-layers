import pgp from 'pg-promise';
import Transaction from '../../domain/entity/Transaction';
import TransactionRepository from '../../domain/repository/TransactionRepository';
import Installment from '../../domain/entity/Installment';
import Connection from './database/Connection';

export default class TransactionDatabaseRepository implements TransactionRepository {

  constructor (
    readonly connection: Connection
  ) {}

  async save(transaction: Transaction): Promise<void> {
    const { code, amount, numberInstallments, paymentMethod } = transaction;

    await this.connection.query('INSERT INTO transactions (code, amount, number_installments, payment_method) VALUES ($1, $2, $3, $4)', [code, amount, numberInstallments, paymentMethod]);

    for (const installment of transaction.installments) {
      await this.connection.query('INSERT INTO installments (code, number, amount) VALUES ($1, $2, $3)', [code, installment.number, installment.amount]);
    }
  }

  async get(code: string): Promise<Transaction> {
    const transactionData = await this.connection.one('SELECT * FROM transactions WHERE code = $1', [code]);

    const transaction = new Transaction(
      transactionData.code,
      parseFloat(transactionData.amount),
      transactionData.number_installments,
      transactionData.payment_method
    );

    const installmentsData = await this.connection.query('SELECT * FROM installments WHERE code = $1', [code]);

    for (const installmentData of installmentsData) {
      transaction.installments.push(new Installment(
        installmentData.number,
        parseFloat(installmentData.amount)
      ));
    }

    return transaction;
  }

}