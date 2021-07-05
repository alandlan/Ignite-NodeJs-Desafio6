import request from "supertest"
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database"


let connection: Connection;

describe("Authenticate User", () =>{
  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to authenticate a user", async()=>{
    await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "authenticate@rentx.com.br",
      password: "admin",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "authenticate@rentx.com.br",
      password: "admin",
    });

    expect(response.status).toBe(200);
  })

  it("should not be able to authenticate a user if email or password is wrong", async()=>{

    await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "authenticatee@rentx.com.br",
      password: "admin",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "authenticatee@rentx.com.br",
      password: "1234",
    });

    expect(response.status).toEqual(401);
  })

  it("should not be able to authenticate a user if not exists", async()=>{

    const response = await request(app).post("/api/v1/sessions").send({
      email: "authenticateee@rentx.com.br",
      password: "adminnn",
    });

    expect(response.status).toEqual(401);
  })
})
