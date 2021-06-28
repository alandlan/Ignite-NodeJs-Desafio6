import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalance: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(()=>{
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepository,statementRepository);
    createUserUseCase = new CreateUserUseCase(userRepository)
    getBalance = new GetBalanceUseCase(statementRepository,userRepository);
  })

  it("should be able to get all statement", async () => {
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

    const balance = await getBalance.execute({user_id: user.id!});

    expect(balance).toHaveProperty("balance");
  })
})
