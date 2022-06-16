import { server } from "..";
import request from "supertest";
import { validate } from "uuid";
import { User } from "../model";

const SUCCESS_CODE = 200;
const CREATED_CODE = 201;
const NO_CONTENT_CODE = 204;
const NOT_FOUND_CODE = 404;

const userData = {
  username: "John Doe",
  age: 22,
  hobbies: ["music"],
};

const userDataToUpdate = {
  username: "Joe Black",
  age: 33,
};

describe("Get all records with a GET api/users request", () => {
  it("should return an empty array at start", async () => {
    const res = await request(server).get("/api/users");
    expect(res.statusCode).toBe(SUCCESS_CODE);
    expect(res.body).toEqual([]);
  });
});

describe("A new object is created by a POST api/users request", () => {
  let createdUser: User;

  afterAll(async () => {
    const { id } = createdUser;
    await request(server).delete(`/api/users/${id}`);
  });

  test("a response containing newly created record", async () => {
    const res = await request(server).post("/api/users").send(userData);

    expect(res.statusCode).toBe(CREATED_CODE);
    expect(res.body.username).toBe(userData.username);
    expect(res.body.age).toBe(userData.age);
    expect(res.body.hobbies).toEqual(userData.hobbies);
    expect(validate(res.body.id)).toBe(true);
    expect(Object.keys(res.body).length).toBe(4);

    createdUser = res.body;
  });
});

describe("Tests for getById, update, delete", () => {
  let createdUser: User;

  beforeAll(async () => {
    const res = await request(server).post("/api/users").send(userData);
    createdUser = res.body;
  });

  test("With a GET api/user/{userId} request, we try to get the created record by its id", async () => {
    const { id } = createdUser;

    const res = await request(server).get(`/api/users/${id}`);

    expect(res.statusCode).toBe(SUCCESS_CODE);
    expect(res.body).toEqual(createdUser);
  });

  test("With a PUT api/users/{userId} request, we try to update the created record", async () => {
    const { id } = createdUser;

    const res = await request(server)
      .put(`/api/users/${id}`)
      .send(userDataToUpdate);

    expect(res.statusCode).toBe(SUCCESS_CODE);
    expect(res.body).toEqual({ ...createdUser, ...userDataToUpdate });
  });

  test("With a DELETE api/users/{userId} request, we delete the created object by id", async () => {
    const { id } = createdUser;

    const res = await request(server).delete(`/api/users/${id}`);
    expect(res.statusCode).toBe(NO_CONTENT_CODE);
  });

  test("With a GET api/users/{userId} request, we are trying to get a deleted object by id", async () => {
    const { id } = createdUser;

    const res = await request(server).get(`/api/users/${id}`);

    expect(res.statusCode).toBe(NOT_FOUND_CODE);
    expect(res.body).toEqual({ message: `user with id=${id} doesn't exist` });
  });
});
