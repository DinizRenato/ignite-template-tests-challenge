import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it('should be able to create a new user', async () => {

        const userCreated = await createUserUseCase.execute({
            name: 'UserTest',
            email: 'user@finapi.com.br',
            password: '123456'
        });

        expect(userCreated).toHaveProperty("id");

    });

    it("should not be able to create a new user that already exists", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: 'UserTest',
                email: 'user@finapi.com.br',
                password: '123456'
            });

            await createUserUseCase.execute({
                name: 'UserTest',
                email: 'user@finapi.com.br',
                password: '123456'
            });
        }).rejects.toBeInstanceOf(CreateUserError);
    });

});
