import request from "supertest"
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database"


let connection: Connection;

describe("Create a new User", () =>{
  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new user", async()=>{
    const response = await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "create@rentx.com.br",
      password: "admin",
    });

    expect(response.status).toBe(201);
  })

  it("should not be able to create a new user if already exists", async()=>{
    const response = await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "create@rentx.com.br",
      password: "admin",
    });

    expect(response.status).toBe(400);
  })
})
