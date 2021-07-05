import request from "supertest"
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database"


let connection: Connection;

describe("Get Balance", () =>{
  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to get balance", async()=>{
    await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "getBalance@rentx.com.br",
      password: "admin",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "getBalance@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Credito"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.balance).toBe(100);
  })


})
