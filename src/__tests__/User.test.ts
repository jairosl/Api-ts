import { getConnection } from "typeorm";
import request from "supertest";
import createConnection from "../database";
import { app } from "../app";

describe("Users", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });
  beforeEach(async () => {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  });
  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Should be able no create user if already exists", async () => {
    const user = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const userAlreadyExists = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    expect(user.status).toBe(201);
    expect(userAlreadyExists.status).toBe(400);
    expect(userAlreadyExists.body).toHaveProperty("message");
  });

  it("Should be able to get user by id", async () => {
    const response = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const getUsers = await request(app).get(`/user/${response.body.id}`);

    expect(response.status).toBe(201);
    expect(getUsers.body).toHaveProperty("id");
  });

  it("Should be able to update a user by id", async () => {
    const response = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const UserUpdate = await request(app).put(`/user/${response.body.id}`).send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "Any User",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    expect(UserUpdate.status).toBe(200);
    expect(UserUpdate.body.name).toBe("Any User");
  });

  it("Should be able to delete a user by id", async () => {
    const response = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });
    const deleteUser = await request(app).delete(`/user/${response.body.id}`).send({ password: "jairo" });

    expect(deleteUser.status).toBe(200);
  });

  it("Should be able no delete a user by id with password invalid", async () => {
    const response = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });
    const deleteUser = await request(app).delete(`/user/${response.body.id}`).send({ password: "any" });

    expect(deleteUser.status).toBe(400);
    expect(deleteUser.body).toHaveProperty("message");
  });

  it("Should be able no delete a user by id without password", async () => {
    const response = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });
    const deleteUser = await request(app).delete(`/user/${response.body.id}`).send({ });

    expect(deleteUser.status).toBe(400);
    expect(deleteUser.body).toHaveProperty("message");
    expect(deleteUser.body.message).toBe("No password provider");
  });

  it("Should be able no create user without attributes in request", async () => {
    const response = await request(app).post("/user").send({

    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("Should be able no create user with email invalid", async () => {
    const response = await request(app).post("/user").send({
      email: "jairo",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Email invalid");
  });

  it("Should be able no update user without attributes in request", async () => {
    const response = await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const UserUpdate = await request(app).put(`/user/${response.body.id}`).send({});

    expect(UserUpdate.status).toBe(400);
    expect(UserUpdate.body).toHaveProperty("message");
  });
});
