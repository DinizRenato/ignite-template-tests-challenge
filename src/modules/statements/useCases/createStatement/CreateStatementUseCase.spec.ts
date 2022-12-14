import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create a new Statement", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository
        );
    });

    it("should be able to create a new statement as a deposit", async () => {

        const userCreated = await createUserUseCase.execute({
            name: 'UserTest',
            email: 'user@finapi.com.br',
            password: '123456'
        });

        const statement = await createStatementUseCase.execute({
            user_id: String(userCreated.id),
            amount: 1000,
            description: "Salary",
            type: OperationType.DEPOSIT,
        });

        expect(statement).toHaveProperty("id");

    })

    it("should be able to create a new statement as a withdraw", async () => {

        const userCreated = await createUserUseCase.execute({
            name: 'UserTest',
            email: 'user@finapi.com.br',
            password: '123456'
        });

        await createStatementUseCase.execute({
            user_id: String(userCreated.id),
            amount: 1000,
            description: "Salary",
            type: OperationType.DEPOSIT,
        });

        const statement = await createStatementUseCase.execute({
            user_id: String(userCreated.id),
            amount: 500,
            description: "Credit Card",
            type: OperationType.WITHDRAW,
        });

        expect(statement).toHaveProperty("id");

    })

    it("should not be able to create a new statement, because the user was not found", async () => {
        expect(async () => {
            await createStatementUseCase.execute({
                amount: 1000,
                description: "Salary",
                type: OperationType.DEPOSIT,
                user_id: "invalid_id",
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should not be able to create a new statement, because the user's funds are insufficient", async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create({
                name: 'UserTest',
                email: 'user@finapi.com.br',
                password: '123456'
            });

            await createStatementUseCase.execute({
                amount: 500,
                description: "Credit Card",
                type: OperationType.WITHDRAW,
                user_id: String(user.id),
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });

})
