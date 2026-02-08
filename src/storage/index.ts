import { MongoClient } from 'mongodb';
import * as MongoDb from 'mongodb';

import { UserStorage } from './storages/user';

type MongoDbConfig = {
  url: string;
  database: string;
};

export class Storage {
  public static client: MongoClient;
  public static instance: Storage;

  public readonly user: UserStorage;

  constructor(db: MongoDb.Db) {
    this.user = new UserStorage(db);

    console.info('Database open');
  }

  async createIndexes(): Promise<void> {
    console.info('Creating database indexes...');
    
    await Promise.all([
      this.user.createIndexes(),
    ]);

    console.info('Database indexes created');
  }

  static async open(config: MongoDbConfig): Promise<void> {
    const url = new URL(config.url);
    const database = config.database;

    Storage.client = new MongoDb.MongoClient(url.toString());
    await Storage.client.connect();

    Storage.instance = new Storage(this.client.db(database));
    
    await Storage.instance.createIndexes();
  }

  static async close(): Promise<void> {
    if (Storage.client) {
      await Storage.client.close();
      console.info('Database connection closed');
    }
  }
}

export * from './types/user';
