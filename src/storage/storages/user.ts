import * as MongoDb from 'mongodb';

import { UserCollection } from '../types/user';

export class UserStorage {

  private readonly users: MongoDb.Collection<UserCollection>;

  constructor(db: MongoDb.Db) {
    this.users = db.collection<UserCollection>('user');
  }

  async createIndexes(): Promise<void> {
    await this.users.createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
    ]);
  }

  async addOrUpdate(user: UserCollection): Promise<boolean> {
    const res = await this.users.updateOne(
      { id: user.id },
      { $set: user },
      { upsert: true },
    );
    return res.upsertedCount > 0 || res.modifiedCount > 0;
  }

  async create(user: UserCollection): Promise<boolean> {
    const res = await this.users.insertOne(user);
    return res.acknowledged;
  }

  async update(id: string, update: Partial<UserCollection>): Promise<boolean> {
    const res = await this.users.updateOne(
      { id },
      { $set: { ...update, updatedAt: Date.now() } },
    );
    return res.modifiedCount > 0;
  }

  async getById(id: string): Promise<UserCollection | undefined> {
    return await this.users.findOne({ id }, { projection: { _id: 0 } }) ?? undefined;
  }

  async getByUsername(username: string): Promise<UserCollection | undefined> {
    return await this.users.findOne({ username }, { projection: { _id: 0 } }) ?? undefined;
  }

  async getOneByFilter(filter: MongoDb.Filter<UserCollection>): Promise<UserCollection | undefined> {
    return await this.users.findOne({ ...filter }, { projection: { _id: 0 } }) ?? undefined;
  }

  async updateLastActivity(id: string): Promise<boolean> {
    const res = await this.users.updateOne(
      { id },
      { $set: { lastActivityAt: Date.now() } },
    );
    return res.modifiedCount > 0;
  }
}
