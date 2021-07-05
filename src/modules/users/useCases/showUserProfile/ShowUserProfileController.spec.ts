import request from "supertest"
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database"


let connection: Connection;

describe("Show User Profile", () =>{
  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to show user profile", async()=>{
    await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "showusers@rentx.com.br",
      password: "admin",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "showusers@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  })

  it("should not be able to authenticate a user if email or password is wrong", async()=>{

    await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "adminn@rentx.com.br",
      password: "admin",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "adminn@rentx.com.br",
      password: "1234",
    });

    expect(response.status).toEqual(401);
  })

  it("should not be able to authenticate a user if not exists", async()=>{

    const response = await request(app).post("/api/v1/sessions").send({
      email: "adminnn@rentx.com.br",
      password: "adminnn",
    });

    expect(response.status).toEqual(401);
  })


})
