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

  it("Should be able no create a new jwt token without email or password", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const token = await request(app).post("/signin").send({

    });

    expect(token.status).toBe(400);
    expect(token.body).toHaveProperty("message");
    expect(token.body.message).toBe("Missing email or password provider");
  });

  it("Should be able no create a new jwt token with email invalid ", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const token = await request(app).post("/signin").send({
      email: "jairo1@mail.com",
      password: "jairo",
    });

    expect(token.status).toBe(400);
    expect(token.body).toHaveProperty("message");
    expect(token.body.message).toBe("User not exists");
  });

  it("Should be able no create a new jwt token with password invalid ", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const token = await request(app).post("/signin").send({
      email: "jairo@mail.com",
      password: "jairosl",
    });

    expect(token.status).toBe(400);
    expect(token.body).toHaveProperty("message");
    expect(token.body.message).toBe("email or password invalid");
  });

  it("Should be able to create a new jwt token", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const token = await request(app).post("/signin").send({
      email: "jairo@mail.com",
      password: "jairo",
    });

    expect(token.status).toBe(200);
    expect(token.body).toHaveProperty("token");
  });
});
