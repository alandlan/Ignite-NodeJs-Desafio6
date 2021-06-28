import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a new Uer", () =>{

  beforeEach(()=> {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Alan Martins",
      email: "a@a.com.br",
      password: "1234"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user with same email", async () =>{
    expect(async () => {
      await createUserUseCase.execute({
        name: "Alan Martins",
        email: "a@a.com.br",
        password: "1234"
      });

      await createUserUseCase.execute({
        name: "Alan Martins",
        email: "a@a.com.br",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(AppError);
  })

})
