export default interface Connection {
  query(query: string, params?: any[]): Promise<any>;
  one(query: string, params?: any[]): Promise<any>;
  close(): Promise<void>;
}