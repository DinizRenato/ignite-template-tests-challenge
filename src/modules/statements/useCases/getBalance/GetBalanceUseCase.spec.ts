import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { OperationType } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get Balance", () => {

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

    it("should be able to get the balance", async () => {
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

        const { balance, statement } = await getBalanceUseCase.execute({
            user_id: String(userCreated.id),
        });

        expect(balance).toBe(1000);
        expect(statement.length).toBeGreaterThan(0);
    })

    it("should not be able to get the balance", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({
                user_id: "invalid_id",
            });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });

});
