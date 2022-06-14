import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

type UserData = Omit<User, "id">;

export default class Users {
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
        return { id, ...userData };
      }
      return user;
    });

    return this.getById(id);
  };

  delete = (userId: string) => {
    this.#db = this.#db.filter((user) => user.id !== userId);
  };
}
