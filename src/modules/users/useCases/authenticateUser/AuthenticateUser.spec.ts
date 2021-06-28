import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let userRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase : AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("should be able to do login", () => {

  beforeEach(()=>{
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to do login", async () =>{
    const user = await createUserUseCase.execute({
      name: "Alan Martins",
      email: "a@a.com.br",
      password: "1234"
    });

    const result = await authenticateUserUseCase.execute({
      email: "a@a.com.br",
      password: "1234",
    });

    expect(result).toHaveProperty("token");
  })

  it("should not be able to do login if user not exists", async () =>{
    expect(async()=> {
      const result = await authenticateUserUseCase.execute({
        email: "a@a.com.br",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to do login if password is wrong", async () =>{
    expect(async()=> {
      const user = await createUserUseCase.execute({
        name: "Alan Martins",
        email: "a@a.com.br",
        password: "1234"
      });

      const result = await authenticateUserUseCase.execute({
        email: "a@a.com.br",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
