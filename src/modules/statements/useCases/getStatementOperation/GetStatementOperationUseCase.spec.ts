import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get Statement Operation", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository,
        );
    })
    it("should be able to get statement operation from a user", async () => {
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

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: String(userCreated.id),
            statement_id: String(statement.id),
        });

        expect(statementOperation).toHaveProperty("id");
        expect(statementOperation.amount).toBe(statement.amount);
    });

    it("should not be able to get statement operation from a user not found", async () => {

        expect(async () => {
            const userCreated = await createUserUseCase.execute({
                name: 'UserTest',
                email: 'user@finapi.com.br',
                password: '123456'
            });

            const statement = await createStatementUseCase.execute({
                amount: 500,
                description: "Salary",
                type: OperationType.DEPOSIT,
                user_id: String(userCreated.id),
            });

            await getStatementOperationUseCase.execute({
                user_id: "invalid_id",
                statement_id: String(statement.id),
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    })

    it("should not be able to get statement operation from a not exists statement", async () => {
        expect(async () => {
            const userCreated = await createUserUseCase.execute({
                name: 'UserTest',
                email: 'user@finapi.com.br',
                password: '123456'
            });

            await getStatementOperationUseCase.execute({
                user_id: String(userCreated.id),
                statement_id: "123456789",
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

    })
})
