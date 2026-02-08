export type UserCollection = {
  id: string;

  username: string;
  passwordHash: string;

  createdAt: number;
  updatedAt: number;
  lastActivityAt?: number;
};
