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

  it("Should be able no access router without token", async () => {
    const response = await request(app).post("/address").send({
      street: "Rua any",
      district: "Bairro any",
      number: 180,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No token provider");
  });

  it("Should be able to create address", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const jwtToken = await request(app).post("/signin").send({
      email: "jairo@mail.com",
      password: "jairo",
    });

    const response = await request(app).post("/address").send({
      street: "Rua any",
      district: "Bairro any",
      number: 180,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    }).set("Authorization", `Bearer ${jwtToken.body.token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Should be able no create address with address exists", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const jwtToken = await request(app).post("/signin").send({
      email: "jairo@mail.com",
      password: "jairo",
    });

    await request(app).post("/address").send({
      street: "Rua any",
      district: "Bairro any",
      number: 180,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    }).set("Authorization", `Bearer ${jwtToken.body.token}`);

    const response = await request(app).post("/address").send({
      street: "Rua any",
      district: "Bairro any",
      number: 180,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    }).set("Authorization", `Bearer ${jwtToken.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Address already exists");
  });

  it("Should be able to update address", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const jwtToken = await request(app).post("/signin").send({
      email: "jairo@mail.com",
      password: "jairo",
    });

    const addressNotUpdate = await request(app).post("/address").send({
      street: "Rua any",
      district: "Bairro any",
      number: 180,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    }).set("Authorization", `Bearer ${jwtToken.body.token}`);

    const addressUpdate = await request(app).put(`/address/${addressNotUpdate.body.id}`).send({
      street: "Rua any",
      district: "Bairro any",
      number: 170,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    }).set("Authorization", `Bearer ${jwtToken.body.token}`);

    expect(addressNotUpdate.body.id).toBe(addressUpdate.body.id);
    expect(addressNotUpdate.body.number).toBe(180);
    expect(addressUpdate.body.number).toBe(170);
  });

  it("Should be able to delete address", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const jwtToken = await request(app).post("/signin").send({
      email: "jairo@mail.com",
      password: "jairo",
    });

    const Address = await request(app).post("/address").send({
      street: "Rua any",
      district: "Bairro any",
      number: 180,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    }).set("Authorization", `Bearer ${jwtToken.body.token}`);

    const response = await request(app).delete(`/address/${Address.body.id}`).send({
      street: "Rua any",
      district: "Bairro any",
      number: 180,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    }).set("Authorization", `Bearer ${jwtToken.body.token}`);

    expect(response.status).toBe(200);
  });

  it("Should be able to show address", async () => {
    await request(app).post("/user").send({
      email: "jairo@mail.com",
      password: "jairo",
      name: "jairo",
      telephone: "83993457728",
      birthdate: "10-12-2000",
      weight: 82,
      ethnicity: "pardo",
    });

    const jwtToken = await request(app).post("/signin").send({
      email: "jairo@mail.com",
      password: "jairo",
    });

    const address = await request(app).post("/address").send({
      street: "Rua any",
      district: "Bairro any",
      number: 180,
      complement: "any",
      cep: "78689654",
      city: "cidade any",
      state: "estado any",
    }).set("Authorization", `Bearer ${jwtToken.body.token}`);

    const allAddress = await request(app)
      .get(`/address/${address.body.id}`)
      .set("Authorization", `Bearer ${jwtToken.body.token}`);

    expect(allAddress.status).toBe(200);
    expect(allAddress.body).toHaveProperty("id");
  });
});
