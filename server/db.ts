import {Ticket} from '../client/src/api';
import Knex from 'knex';

export interface DbClient {
  getTickets: () => Promise<Ticket[]>
}

export const dbClient = (opts: {filePath: string}): DbClient => {
  const knex = Knex({
    client: 'sqlite3',
    connection: {
      filename: opts.filePath,
    },
  });
  knex.raw(`CREATE TABLE IF NOT EXISTS 'data' (
    id TEXT,
    title TEXT,
    content TEXT,
    userEmail TEXT,
    creationTime INTEGER,
    labels TEXT);`).then(() => void 0);
  return {
    getTickets(): Promise<Ticket[]> {
      // If you are unfamiliar with knex, you can uncomment the next line and use raw sql
      // return knex.raw('select * from data limit 20');
      return knex('data').select().limit(20);
    }
  }
}


