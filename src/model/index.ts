import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserData = Omit<User, "id">;

class UsersModel {
  #db: User[] = [];

  getAll = () => this.#db;

  getById = (userId: string) => this.#db.find(({ id }) => id === userId);

  create = (userData: UserData) => {
    const newUser = { ...userData, id: uuidv4() };
    this.#db.push(newUser);

    return newUser;
  };

  update = (id: string, userData: UserData) => {
    this.#db = this.#db.map((user) => {
      if (id === user.id) {
        return { ...user, ...userData, id };
      }
      return user;
    });

    return this.getById(id);
  };

  delete = (userId: string) => {
    this.#db = this.#db.filter((user) => user.id !== userId);
  };
}

export const usersModel = new UsersModel();
