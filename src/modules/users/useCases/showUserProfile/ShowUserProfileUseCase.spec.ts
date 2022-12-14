import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show the User Profile", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to show the user profile", async () => {

        const userCreated = await createUserUseCase.execute({
            name: 'UserTest',
            email: 'user@finapi.com.br',
            password: '123456'
        });

        const userProfile = await showUserProfileUseCase.execute(String(userCreated.id));

        expect(userProfile).toHaveProperty("id");
        expect(userProfile.email).toEqual("user@finapi.com.br");

    })

    it("should not be able to show the user profile", () => {
        expect(async () => {
            await showUserProfileUseCase.execute("invalid_id");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });

})
