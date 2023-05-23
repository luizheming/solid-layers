import CreateTransaction from '../src/application/CreateTransaction';
import GetTransaction from '../src/application/GetTransaction';
import TransactionDatabaseRepository from '../src/infra/repository/TransactionDatabaseRepository';
import PostgresSQLAdapter from '../src/infra/repository/database/adapters/PostgresSQLAdapter';

test('Should create a transaction', async () => {
  const connection = new PostgresSQLAdapter();
  const transactionRepository = new TransactionDatabaseRepository(connection);
  
  const code = `${Math.floor(Math.random() * 1000)}`;

  const input = {
    code,
    amount: 1000,
    numberInstallments: 12,
    paymentMethod: 'credit_card',
  };

  const createTransaction = new CreateTransaction(transactionRepository);
  await createTransaction.execute(input);

  const getTransaction = new GetTransaction(transactionRepository);
  const transaction = await getTransaction.execute(code);
 
  expect(transaction.code).toBe(code);
  expect(transaction.amount).toBe(1000);
  expect(transaction.numberInstallments).toBe(12);
  expect(transaction.paymentMethod).toBe('credit_card');
  expect(transaction.installments).toHaveLength(12);
  expect(transaction.installments[0].amount).toBe(83.33);
  expect(transaction.installments[11].amount).toBe(83.37);

  await connection.close();
});