import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to authenticate a user", async () => {
        await createUserUseCase.execute({
            name: 'UserTest',
            email: 'user@finapi.com.br',
            password: '123456'
        })

        const auth = await authenticateUserUseCase.execute({
            email: "user@finapi.com.br",
            password: "123456",
        });

        expect(auth).toHaveProperty("token");
        expect(auth).toHaveProperty("user");

    });

    it("should not be able to authenticate a user with a incorrect email", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: 'UserTest',
                email: 'user@finapi.com.br',
                password: '123456'
            });

            await authenticateUserUseCase.execute({
                email: "user2@finapi.com.br",
                password: "654321",
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
})
