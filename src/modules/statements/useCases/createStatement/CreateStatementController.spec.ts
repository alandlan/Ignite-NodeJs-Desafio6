import request from "supertest"
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database"


let connection: Connection;

describe("Create Statement", () =>{
  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create a new statement type debit", async()=>{
    await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "createStatementdebit@rentx.com.br",
      password: "admin",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "createStatementdebit@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Credito"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  })

  it("should be able to create a new statement type withdraw", async()=>{
    await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "createStatementwithdraw@rentx.com.br",
      password: "admin",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "createStatementwithdraw@rentx.com.br",
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
      .post("/api/v1/statements/withdraw")
      .send({
      amount: 50,
      description: "Debito"
    })
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
  })

  it("should not be able to create a new statement type withdraw if no have founds", async()=>{
    await request(app).post("/api/v1/users").send({
      name: "Admni",
      email: "createStatementwithdrawNoFouds@rentx.com.br",
      password: "admin",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "createStatementwithdrawNoFouds@rentx.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 50,
        description: "Credito"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
      amount: 100,
      description: "Debito"
    })
    .set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(400);
  })


})
