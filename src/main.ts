import ExpressAdapter from './infra/api/ExpressAdapter';
import Router from './infra/api/Router';
import TransactionDatabaseRepository from './infra/repository/TransactionDatabaseRepository';
import PostgresSQLAdapter from './infra/repository/database/adapters/PostgresSQLAdapter';

const httpServer = new ExpressAdapter();

const connection = new PostgresSQLAdapter();
const transactionRepository = new TransactionDatabaseRepository(connection);

const router = new Router(httpServer, transactionRepository);
router.init();

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});