import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatement: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get Statement Operation", () => {
  beforeEach(()=> {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepository,statementRepository);
    createUserUseCase = new CreateUserUseCase(userRepository)
    getStatement = new GetStatementOperationUseCase(userRepository,statementRepository);
  })

  it("should be able to get statement operation", async ()=> {
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

    const statement = await getStatement.execute({statement_id: deposit.id!,user_id: user.id!})

    expect(statement).toHaveProperty("id");

  })

  it("should not be able to get statement operation if statement not exists", async ()=> {

    expect(async()=>{
      const user = await createUserUseCase.execute({
        name: "Alan Martins",
        email: "a@a.com.br",
        password: "1234"
      });

      const statement = await getStatement.execute({statement_id: "12345",user_id: user.id!})
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)



  })

})
