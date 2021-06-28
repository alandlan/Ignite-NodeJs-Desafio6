import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create a new Statement", ()=>{
  beforeEach(()=>{
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepository,statementRepository);
    createUserUseCase = new CreateUserUseCase(userRepository)
  })

  it("should be able to create a new deposit statement", async () =>{
    const user = await createUserUseCase.execute({
      name: "Alan Martins",
      email: "a@a.com.br",
      password: "1234"
    });


    const deposit = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 1000,
      type: OperationType.DEPOSIT,
      description: "Deposito"
    })

    expect(deposit).toHaveProperty("id");
  })

  it("should be able to create a new withdraw statement", async () =>{
    const user = await createUserUseCase.execute({
      name: "Alan Martins",
      email: "a@a.com.br",
      password: "1234"
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 2000,
      type: OperationType.DEPOSIT,
      description: "Deposito"
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 1000,
      type: OperationType.WITHDRAW,
      description: "Credito"
    });

    expect(withdraw).toHaveProperty("id");
  })

  it("should not be able to create a new withdraw statement if no have founds", async () =>{
    expect(async()=> {
      const user = await createUserUseCase.execute({
        name: "Alan Martins",
        email: "a@a.com.br",
        password: "1234"
      });

      const deposit = await createStatementUseCase.execute({
        user_id: user.id!,
        amount: 2000,
        type: OperationType.DEPOSIT,
        description: "Deposito"
      });

      const withdraw = await createStatementUseCase.execute({
        user_id: user.id!,
        amount: 3000,
        type: OperationType.WITHDRAW,
        description: "Credito"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
