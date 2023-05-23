import pgp from 'pg-promise';
import Connection from '../Connection';

export default class PostgresSQLAdapter implements Connection {
  connection: any;

  constructor() {
    this.connection = pgp()('postgres://postgres:secret@localhost:5432/branas');
  }
  query(query: string, params?: any[] | undefined): Promise<any> {
    return this.connection.query(query, params);
  }
  one(query: string, params?: any[] | undefined): Promise<any> {
    return this.connection.one(query, params);
  }
  close(): Promise<void> {
    return this.connection.$pool.end();
  }

}